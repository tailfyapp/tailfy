"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileState } from "@/actions/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";
import type { Profile } from "@/generated/prisma/client";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState<ProfileState, FormData>(
    updateProfileAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Perfil atualizado com sucesso!");
    }
  }, [state]);

  return (
    <form action={formAction} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <h2 className="font-semibold text-gray-900">Informações do negócio</h2>

      {state?.error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3">
          {state.error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          id="businessName"
          name="businessName"
          label="Nome do negócio"
          defaultValue={profile.businessName}
          required
          error={state?.fieldErrors?.businessName?.[0]}
        />
        <Input
          id="slug"
          name="slug"
          label="Slug (URL)"
          defaultValue={profile.slug}
          required
          error={state?.fieldErrors?.slug?.[0]}
        />
      </div>

      <Input
        id="ownerName"
        name="ownerName"
        label="Seu nome"
        defaultValue={profile.ownerName ?? ""}
        error={state?.fieldErrors?.ownerName?.[0]}
      />

      <Textarea
        id="bio"
        name="bio"
        label="Bio"
        rows={3}
        defaultValue={profile.bio ?? ""}
        placeholder="Conte um pouco sobre seu negócio..."
        error={state?.fieldErrors?.bio?.[0]}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          id="phone"
          name="phone"
          label="Telefone"
          defaultValue={profile.phone ?? ""}
        />
        <Input
          id="whatsapp"
          name="whatsapp"
          label="WhatsApp (com DDD)"
          defaultValue={profile.whatsapp ?? ""}
          placeholder="5511999999999"
        />
      </div>

      <Input
        id="instagram"
        name="instagram"
        label="Instagram"
        defaultValue={profile.instagram ?? ""}
        placeholder="@seunegocio"
      />

      <Textarea
        id="address"
        name="address"
        label="Endereço"
        rows={2}
        defaultValue={profile.address ?? ""}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          id="city"
          name="city"
          label="Cidade"
          defaultValue={profile.city ?? ""}
        />
        <Input
          id="state"
          name="state"
          label="Estado"
          defaultValue={profile.state ?? ""}
          maxLength={2}
          placeholder="SP"
        />
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
