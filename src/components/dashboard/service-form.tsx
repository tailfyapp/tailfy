"use client";

import { useActionState, useEffect } from "react";
import { createServiceAction, updateServiceAction, type ServiceState } from "@/actions/services";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Service } from "@/generated/prisma/client";

interface ServiceFormProps {
  service?: Service;
  onSuccess?: () => void;
}

export function ServiceForm({ service, onSuccess }: ServiceFormProps) {
  const action = service
    ? updateServiceAction.bind(null, service.id)
    : createServiceAction;

  const [state, formAction, isPending] = useActionState<ServiceState, FormData>(action, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(service ? "Serviço atualizado!" : "Serviço criado!");
      onSuccess?.();
    }
  }, [state, service, onSuccess]);

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
        label="Nome do serviço"
        defaultValue={service?.name ?? ""}
        required
        error={state?.fieldErrors?.name?.[0]}
      />

      <Textarea
        id="description"
        name="description"
        label="Descrição"
        rows={3}
        defaultValue={service?.description ?? ""}
        error={state?.fieldErrors?.description?.[0]}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="priceMin"
          name="priceMin"
          label="Preço mínimo (R$)"
          type="number"
          step="0.01"
          min="0"
          defaultValue={service?.priceMin?.toString() ?? ""}
          error={state?.fieldErrors?.priceMin?.[0]}
        />
        <Input
          id="priceMax"
          name="priceMax"
          label="Preço máximo (R$)"
          type="number"
          step="0.01"
          min="0"
          defaultValue={service?.priceMax?.toString() ?? ""}
          error={state?.fieldErrors?.priceMax?.[0]}
        />
      </div>

      <Input
        id="duration"
        name="duration"
        label="Duração (minutos)"
        type="number"
        min="5"
        max="480"
        defaultValue={service?.duration?.toString() ?? ""}
        error={state?.fieldErrors?.duration?.[0]}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Salvando..." : service ? "Salvar" : "Criar serviço"}
        </Button>
      </div>
    </form>
  );
}
