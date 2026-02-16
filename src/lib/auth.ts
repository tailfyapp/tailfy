import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import { findValidToken, consumeToken, validateTrustedDevice } from "@/lib/tokens";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        twoFactorCode: {},
        trustedDeviceToken: {},
      },
      async authorize(credentials) {
        const email = credentials.email as string;
        const password = credentials.password as string;
        const twoFactorCode = credentials.twoFactorCode as string | undefined;
        const trustedDeviceToken = credentials.trustedDeviceToken as string | undefined;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { profile: { select: { id: true } } },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // Check trusted device — skip 2FA
        if (trustedDeviceToken) {
          const isTrusted = await validateTrustedDevice(trustedDeviceToken, user.id);
          if (isTrusted) {
            return {
              id: user.id,
              email: user.email,
              profileId: user.profile?.id ?? null,
            };
          }
        }

        // Require 2FA code
        if (!twoFactorCode) return null;

        const tokenRecord = await findValidToken(twoFactorCode, "TWO_FACTOR");
        if (!tokenRecord || tokenRecord.userId !== user.id) return null;

        await consumeToken(tokenRecord.id);

        return {
          id: user.id,
          email: user.email,
          profileId: user.profile?.id ?? null,
        };
      },
    }),
  ],
});
