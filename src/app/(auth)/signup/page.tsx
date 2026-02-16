"use client";

import { useState, useActionState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  signupAction,
  setTrustedDeviceCookie,
  type SignupState,
} from "@/actions/auth";

export default function SignupPage() {
  const [step, setStep] = useState<"form" | "code">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function handleSignup(
    prev: SignupState,
    formData: FormData
  ): Promise<SignupState> {
    const result = await signupAction(prev, formData);

    if (result?.requiresTwoFactor && result.email) {
      setEmail(result.email);
      setPassword(formData.get("password") as string);
      setStep("code");
    }

    return result;
  }

  const [state, formAction, isPending] = useActionState<SignupState, FormData>(
    handleSignup,
    null
  );

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCodeError("");
    setIsSigningIn(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        twoFactorCode: code,
        redirect: false,
      });

      if (result?.error) {
        setIsSigningIn(false);
        setCodeError("Código inválido ou expirado.");
        return;
      }
    } catch {
      setIsSigningIn(false);
      setCodeError("Código inválido ou expirado.");
      return;
    }

    setTrustedDeviceCookie().catch(() => {});

    window.location.href = "/dashboard";
  }

  if (step === "code") {
    return (
      <>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Verificação em duas etapas
        </h1>
        <p className="text-gray-500 mb-6">
          Enviamos um código de 6 dígitos para{" "}
          <span className="font-medium text-gray-700">{email}</span>
        </p>

        <form onSubmit={handleCodeSubmit} className="space-y-4">
          {codeError && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3">
              {codeError}
            </div>
          )}

          <Input
            id="code"
            name="code"
            type="text"
            label="Código de verificação"
            placeholder="000000"
            required
            maxLength={6}
            autoComplete="one-time-code"
            value={code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCode(e.target.value)
            }
            autoFocus
          />

          <Button type="submit" className="w-full" disabled={isSigningIn}>
            {isSigningIn ? "Verificando..." : "Verificar e acessar"}
          </Button>
        </form>
      </>
    );
  }

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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Criando conta..." : "Criar minha vitrine"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="text-purple-600 font-medium hover:underline"
        >
          Entrar
        </Link>
      </p>
    </>
  );
}
