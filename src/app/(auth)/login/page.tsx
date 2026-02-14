"use client";

import { useActionState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LoginState = { error?: string } | null;

export default function LoginPage() {
  const router = useRouter();

  async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Preencha todos os campos." };
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Email ou senha incorretos." };
    }

    router.push("/dashboard");
    router.refresh();
    return null;
  }

  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Entrar</h1>
      <p className="text-gray-500 mb-6">
        Acesse seu painel de gestão.
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

        <Input
          id="password"
          name="password"
          type="password"
          label="Senha"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Não tem conta?{" "}
        <Link href="/signup" className="text-purple-600 font-medium hover:underline">
          Criar conta
        </Link>
      </p>
    </>
  );
}
