import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Link inválido
        </h1>
        <p className="text-gray-500">
          Este link de redefinição de senha é inválido ou expirou.{" "}
          <a
            href="/forgot-password"
            className="text-purple-600 font-medium hover:underline"
          >
            Solicitar um novo
          </a>
        </p>
      </>
    );
  }

  return <ResetPasswordForm token={token} />;
}
