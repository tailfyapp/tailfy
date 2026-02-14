"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { clientSchema } from "@/lib/validators";

export type ClientState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function createClientAction(
  _prev: ClientState,
  formData: FormData
): Promise<ClientState> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const raw = {
    name: formData.get("name") as string,
    phone: (formData.get("phone") as string) || undefined,
    email: (formData.get("email") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  };

  const result = clientSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { fieldErrors };
  }

  await prisma.client.create({
    data: {
      ...result.data,
      email: result.data.email || null,
      profileId: user.profileId,
    },
  });

  revalidatePath("/dashboard/clientes");
  return { success: true };
}

export async function updateClientAction(
  clientId: string,
  _prev: ClientState,
  formData: FormData
): Promise<ClientState> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { profileId: true },
  });

  if (!client || client.profileId !== user.profileId) {
    return { error: "Cliente não encontrado." };
  }

  const raw = {
    name: formData.get("name") as string,
    phone: (formData.get("phone") as string) || undefined,
    email: (formData.get("email") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  };

  const result = clientSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { fieldErrors };
  }

  await prisma.client.update({
    where: { id: clientId },
    data: {
      ...result.data,
      email: result.data.email || null,
    },
  });

  revalidatePath("/dashboard/clientes");
  revalidatePath(`/dashboard/clientes/${clientId}`);
  return { success: true };
}

export async function deleteClientAction(clientId: string): Promise<{ error?: string }> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { profileId: true },
  });

  if (!client || client.profileId !== user.profileId) {
    return { error: "Cliente não encontrado." };
  }

  await prisma.client.delete({ where: { id: clientId } });
  revalidatePath("/dashboard/clientes");
  return {};
}
