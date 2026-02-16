import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export function generateSixDigitCode(): string {
  const bytes = crypto.randomBytes(4);
  const num = bytes.readUInt32BE(0) % 1000000;
  return num.toString().padStart(6, "0");
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function upsertVerificationToken(
  userId: string,
  type: "TWO_FACTOR" | "PASSWORD_RESET",
  token: string,
  expiresInMinutes: number
) {
  // Delete previous tokens of same type for this user
  await prisma.verificationToken.deleteMany({
    where: { userId, type },
  });

  return prisma.verificationToken.create({
    data: {
      userId,
      type,
      token,
      expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000),
    },
  });
}

export async function findValidToken(
  token: string,
  type: "TWO_FACTOR" | "PASSWORD_RESET"
) {
  return prisma.verificationToken.findFirst({
    where: {
      token,
      type,
      expiresAt: { gt: new Date() },
    },
  });
}

export async function consumeToken(id: string) {
  return prisma.verificationToken.delete({ where: { id } });
}

export async function createTrustedDevice(userId: string): Promise<string> {
  const token = generateSecureToken();
  await prisma.trustedDevice.create({
    data: {
      userId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });
  return token;
}

export async function validateTrustedDevice(
  token: string,
  userId: string
): Promise<boolean> {
  const device = await prisma.trustedDevice.findFirst({
    where: {
      token,
      userId,
      expiresAt: { gt: new Date() },
    },
  });
  return !!device;
}
