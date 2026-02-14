"use client";

import { useRouter } from "next/navigation";
import { ClientForm } from "./client-form";

export function ClientFormPage() {
  const router = useRouter();

  return (
    <ClientForm
      onSuccess={() => router.push("/dashboard/clientes")}
    />
  );
}
