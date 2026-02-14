"use client";

import { useActionState, useEffect } from "react";
import { createPetAction, updatePetAction, type PetState } from "@/actions/pets";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Pet } from "@/generated/prisma/client";

const PET_SIZES = [
  { value: "", label: "Selecione..." },
  { value: "SMALL", label: "Pequeno" },
  { value: "MEDIUM", label: "Médio" },
  { value: "LARGE", label: "Grande" },
  { value: "EXTRA_LARGE", label: "Extra Grande" },
];

interface PetFormProps {
  clientId: string;
  pet?: Pet;
  onSuccess?: () => void;
}

export function PetForm({ clientId, pet, onSuccess }: PetFormProps) {
  const action = pet
    ? updatePetAction.bind(null, pet.id)
    : createPetAction.bind(null, clientId);

  const [state, formAction, isPending] = useActionState<PetState, FormData>(action, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(pet ? "Pet atualizado!" : "Pet cadastrado!");
      onSuccess?.();
    }
  }, [state, pet, onSuccess]);

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
        label="Nome do pet"
        defaultValue={pet?.name ?? ""}
        required
        error={state?.fieldErrors?.name?.[0]}
      />

      <Input
        id="breed"
        name="breed"
        label="Raça"
        defaultValue={pet?.breed ?? ""}
        error={state?.fieldErrors?.breed?.[0]}
      />

      <Select
        id="size"
        name="size"
        label="Porte"
        defaultValue={pet?.size ?? ""}
        error={state?.fieldErrors?.size?.[0]}
      >
        {PET_SIZES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </Select>

      <Textarea
        id="notes"
        name="notes"
        label="Observações"
        rows={3}
        defaultValue={pet?.notes ?? ""}
        error={state?.fieldErrors?.notes?.[0]}
      />

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Salvando..." : pet ? "Salvar" : "Cadastrar pet"}
      </Button>
    </form>
  );
}
