"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPassword, type ForgotPasswordState } from "@/actions/auth";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState<
    ForgotPasswordState,
    FormData
  >(forgotPassword, null);

  if (state?.success) {
    return (
      <>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Email enviado
        </h1>
        <p className="text-gray-500 mb-6">
          Se existe uma conta com esse email, você receberá um link para
          redefinir sua senha. Verifique sua caixa de entrada e spam.
        </p>
        <Link
          href="/login"
          className="block text-center text-sm text-purple-600 font-medium hover:underline"
        >
          Voltar ao login
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Esqueceu sua senha?
      </h1>
      <p className="text-gray-500 mb-6">
        Digite seu email e enviaremos um link para redefinir sua senha.
      </p>

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3">
            {state.error}
          </div>
        )}

        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="seu@email.com"
          required
          autoComplete="email"
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Enviando..." : "Enviar link de redefinição"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Lembrou a senha?{" "}
        <Link
          href="/login"
          className="text-purple-600 font-medium hover:underline"
        >
          Voltar ao login
        </Link>
      </p>
    </>
  );
}
