"use client";

import { useState, useActionState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  requestTwoFactorCode,
  setTrustedDeviceCookie,
  type TwoFactorState,
} from "@/actions/auth";

export default function LoginPage() {
  const [step, setStep] = useState<"credentials" | "code">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function handleStep1(
    _prev: TwoFactorState,
    formData: FormData
  ): Promise<TwoFactorState> {
    const result = await requestTwoFactorCode(_prev, formData);

    if (result?.error) return result;

    const formEmail = formData.get("email") as string;
    const formPassword = formData.get("password") as string;
    setEmail(formEmail);
    setPassword(formPassword);

    if (result?.trusted) {
      // Trusted device — sign in directly
      setIsSigningIn(true);
      const cookieStore = document.cookie;
      const trustedToken = cookieStore
        .split("; ")
        .find((c) => c.startsWith("trusted_device="))
        ?.split("=")[1];

      const signInResult = await signIn("credentials", {
        email: formEmail,
        password: formPassword,
        trustedDeviceToken: trustedToken || "",
        redirect: false,
      });

      if (signInResult?.error) {
        setIsSigningIn(false);
        return { error: "Erro ao fazer login. Tente novamente." };
      }

      window.location.href = "/dashboard";
      return null;
    }

    // 2FA required
    setStep("code");
    return result;
  }

  const [state, formAction, isPending] = useActionState(handleStep1, null);

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

    // Set trusted device (non-blocking — don't delay navigation)
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
            autoFocus
          />

          <Button type="submit" className="w-full" disabled={isSigningIn}>
            {isSigningIn ? "Verificando..." : "Verificar"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => {
            setStep("credentials");
            setCode("");
            setCodeError("");
          }}
          className="block w-full text-center text-sm text-gray-500 mt-4 hover:text-purple-600"
        >
          Voltar ao login
        </button>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Entrar</h1>
      <p className="text-gray-500 mb-6">Acesse seu painel de gestão.</p>

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
          disabled={isPending || isSigningIn}
        >
          {isPending || isSigningIn ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="flex items-center justify-between mt-6">
        <Link
          href="/forgot-password"
          className="text-sm text-purple-600 font-medium hover:underline"
        >
          Esqueci minha senha
        </Link>
        <p className="text-sm text-gray-500">
          Não tem conta?{" "}
          <Link
            href="/signup"
            className="text-purple-600 font-medium hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </>
  );
}
