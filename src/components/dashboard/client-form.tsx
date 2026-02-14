"use client";

import { useActionState, useEffect } from "react";
import { createClientAction, updateClientAction, type ClientState } from "@/actions/clients";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Client } from "@/generated/prisma/client";

interface ClientFormProps {
  client?: Client;
  onSuccess?: () => void;
}

export function ClientForm({ client, onSuccess }: ClientFormProps) {
  const action = client
    ? updateClientAction.bind(null, client.id)
    : createClientAction;

  const [state, formAction, isPending] = useActionState<ClientState, FormData>(action, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(client ? "Cliente atualizado!" : "Cliente cadastrado!");
      onSuccess?.();
    }
  }, [state, client, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3">
          {state.error}
        </div>
      )}

      <Input
        id="name"
        name="name"
        label="Nome"
        defaultValue={client?.name ?? ""}
        required
        error={state?.fieldErrors?.name?.[0]}
      />

      <Input
        id="phone"
        name="phone"
        label="Telefone"
        defaultValue={client?.phone ?? ""}
        error={state?.fieldErrors?.phone?.[0]}
      />

      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        defaultValue={client?.email ?? ""}
        error={state?.fieldErrors?.email?.[0]}
      />

      <Textarea
        id="notes"
        name="notes"
        label="Observações"
        rows={3}
        defaultValue={client?.notes ?? ""}
        error={state?.fieldErrors?.notes?.[0]}
      />

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Salvando..." : client ? "Salvar" : "Cadastrar cliente"}
      </Button>
    </form>
  );
}
