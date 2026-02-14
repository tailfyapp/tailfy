"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { petSchema } from "@/lib/validators";
import type { PetSize } from "@/generated/prisma/client";

export type PetState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

async function verifyClientOwnership(clientId: string, profileId: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { profileId: true },
  });
  return client?.profileId === profileId;
}

export async function createPetAction(
  clientId: string,
  _prev: PetState,
  formData: FormData
): Promise<PetState> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const isOwner = await verifyClientOwnership(clientId, user.profileId);
  if (!isOwner) return { error: "Cliente não encontrado." };

  const raw = {
    name: formData.get("name") as string,
    breed: (formData.get("breed") as string) || undefined,
    size: (formData.get("size") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  };

  const result = petSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { fieldErrors };
  }

  await prisma.pet.create({
    data: {
      ...result.data,
      size: result.data.size as PetSize | undefined,
      clientId,
    },
  });

  revalidatePath(`/dashboard/clientes/${clientId}`);
  return { success: true };
}

export async function updatePetAction(
  petId: string,
  _prev: PetState,
  formData: FormData
): Promise<PetState> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    include: { client: { select: { profileId: true } } },
  });

  if (!pet || pet.client.profileId !== user.profileId) {
    return { error: "Pet não encontrado." };
  }

  const raw = {
    name: formData.get("name") as string,
    breed: (formData.get("breed") as string) || undefined,
    size: (formData.get("size") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  };

  const result = petSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { fieldErrors };
  }

  await prisma.pet.update({
    where: { id: petId },
    data: {
      ...result.data,
      size: result.data.size as PetSize | undefined,
    },
  });

  revalidatePath(`/dashboard/clientes/${pet.clientId}`);
  return { success: true };
}

export async function deletePetAction(petId: string): Promise<{ error?: string }> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    include: { client: { select: { profileId: true } } },
  });

  if (!pet || pet.client.profileId !== user.profileId) {
    return { error: "Pet não encontrado." };
  }

  await prisma.pet.delete({ where: { id: petId } });
  revalidatePath(`/dashboard/clientes/${pet.clientId}`);
  return {};
}
