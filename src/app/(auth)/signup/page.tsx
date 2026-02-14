"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signupAction, type SignupState } from "@/actions/auth";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<SignupState, FormData>(signupAction, null);

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Criar conta</h1>
      <p className="text-gray-500 mb-6">
        Crie sua vitrine digital em minutos.
      </p>

      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3">
            {state.error}
          </div>
        )}

        <Input
          id="businessName"
          name="businessName"
          label="Nome do negócio"
          placeholder="Ex: Pet Shop do João"
          required
          error={state?.fieldErrors?.businessName?.[0]}
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="seu@email.com"
          required
          autoComplete="email"
          error={state?.fieldErrors?.email?.[0]}
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Senha"
          placeholder="Mínimo 6 caracteres"
          required
          autoComplete="new-password"
          error={state?.fieldErrors?.password?.[0]}
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirmar senha"
          placeholder="Repita a senha"
          required
          autoComplete="new-password"
          error={state?.fieldErrors?.confirmPassword?.[0]}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Criando conta..." : "Criar minha vitrine"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Já tem conta?{" "}
        <Link href="/login" className="text-purple-600 font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </>
  );
}
