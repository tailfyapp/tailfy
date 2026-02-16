"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import {
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validators";
import {
  generateSixDigitCode,
  generateSecureToken,
  upsertVerificationToken,
  findValidToken,
  consumeToken,
  createTrustedDevice,
  validateTrustedDevice,
} from "@/lib/tokens";
import { sendTwoFactorCode, sendPasswordResetEmail } from "@/lib/email";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function generateUniqueSlug(base: string): Promise<string> {
  let slug = slugify(base);
  let suffix = 0;

  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const existing = await prisma.profile.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
    suffix++;
  }
}

// ─── Signup ──────────────────────────────────────────────

export type SignupState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  requiresTwoFactor?: boolean;
  email?: string;
} | null;

export async function signupAction(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    businessName: formData.get("businessName") as string,
  };

  const result = signupSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { fieldErrors };
  }

  const { email, password, businessName } = result.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return { error: "Este email já está cadastrado." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const slug = await generateUniqueSlug(businessName);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      profile: {
        create: {
          slug,
          businessName,
        },
      },
    },
  });

  // Generate 2FA code and send email
  const code = generateSixDigitCode();
  await upsertVerificationToken(user.id, "TWO_FACTOR", code, 10);
  await sendTwoFactorCode(email, code);

  return { requiresTwoFactor: true, email };
}

// ─── Request Two-Factor Code (Login Step 1) ─────────────

export type TwoFactorState = {
  error?: string;
  success?: boolean;
  trusted?: boolean;
  email?: string;
} | null;

export async function requestTwoFactorCode(
  _prev: TwoFactorState,
  formData: FormData
): Promise<TwoFactorState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Preencha todos os campos." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, password: true },
  });

  if (!user) {
    return { error: "Email ou senha incorretos." };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { error: "Email ou senha incorretos." };
  }

  // Check for trusted device cookie
  const cookieStore = await cookies();
  const trustedToken = cookieStore.get("trusted_device")?.value;
  if (trustedToken) {
    const isTrusted = await validateTrustedDevice(trustedToken, user.id);
    if (isTrusted) {
      return { trusted: true, email };
    }
  }

  // Generate and send 2FA code
  const code = generateSixDigitCode();
  await upsertVerificationToken(user.id, "TWO_FACTOR", code, 10);
  await sendTwoFactorCode(email, code);

  return { success: true, email };
}

// ─── Set Trusted Device Cookie ──────────────────────────

export async function setTrustedDeviceCookie() {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return;

  const token = await createTrustedDevice(userId);
  const cookieStore = await cookies();
  cookieStore.set("trusted_device", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}

// ─── Forgot Password ────────────────────────────────────

export type ForgotPasswordState = {
  error?: string;
  success?: boolean;
} | null;

export async function forgotPassword(
  _prev: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const raw = { email: formData.get("email") as string };
  const result = forgotPasswordSchema.safeParse(raw);

  if (!result.success) {
    return { error: "Email inválido." };
  }

  const { email } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  // Always return success to prevent email enumeration
  if (!user) {
    return { success: true };
  }

  const token = generateSecureToken();
  await upsertVerificationToken(user.id, "PASSWORD_RESET", token, 30);

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  await sendPasswordResetEmail(email, resetUrl);

  return { success: true };
}

// ─── Reset Password ─────────────────────────────────────

export type ResetPasswordState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
} | null;

export async function resetPassword(
  _prev: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const raw = {
    token: formData.get("token") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = resetPasswordSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { fieldErrors };
  }

  const { token, password } = result.data;

  const tokenRecord = await findValidToken(token, "PASSWORD_RESET");
  if (!tokenRecord) {
    return { error: "Link expirado ou inválido. Solicite um novo." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: { password: hashedPassword },
  });

  await consumeToken(tokenRecord.id);

  return { success: true };
}
