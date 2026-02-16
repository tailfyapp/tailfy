import { resend, FROM_EMAIL } from "@/lib/resend";
import { TwoFactorCodeEmail } from "@/emails/two-factor-code";
import { PasswordResetEmail } from "@/emails/password-reset";

export async function sendTwoFactorCode(to: string, code: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `${code} — Código de verificação Tailfy`,
    react: <TwoFactorCodeEmail code={code} />,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Redefinir sua senha — Tailfy",
    react: <PasswordResetEmail resetUrl={resetUrl} />,
  });
}
