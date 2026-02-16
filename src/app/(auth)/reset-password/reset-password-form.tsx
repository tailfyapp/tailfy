"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword, type ResetPasswordState } from "@/actions/auth";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState<
    ResetPasswordState,
    FormData
  >(resetPassword, null);

  if (state?.success) {
    return (
      <>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Senha redefinida
        </h1>
        <p className="text-gray-500 mb-6">
          Sua senha foi atualizada com sucesso.
        </p>
        <Link
          href="/login"
          className="block text-center bg-purple-600 text-white rounded-full px-6 py-3 font-medium hover:bg-purple-700 transition-colors"
        >
          Fazer login
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Nova senha</h1>
      <p className="text-gray-500 mb-6">Digite sua nova senha abaixo.</p>

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3">
            {state.error}
          </div>
        )}

        <input type="hidden" name="token" value={token} />

        <Input
          id="password"
          name="password"
          type="password"
          label="Nova senha"
          placeholder="Mínimo 6 caracteres"
          required
          autoComplete="new-password"
          error={state?.fieldErrors?.password?.[0]}
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirmar nova senha"
          placeholder="Repita a senha"
          required
          autoComplete="new-password"
          error={state?.fieldErrors?.confirmPassword?.[0]}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Redefinindo..." : "Redefinir senha"}
        </Button>
      </form>
    </>
  );
}
