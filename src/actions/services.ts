"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { serviceSchema } from "@/lib/validators";

export type ServiceState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function createServiceAction(
  _prev: ServiceState,
  formData: FormData
): Promise<ServiceState> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    priceMin: formData.get("priceMin") ? Number(formData.get("priceMin")) : undefined,
    priceMax: formData.get("priceMax") ? Number(formData.get("priceMax")) : undefined,
    duration: formData.get("duration") ? Number(formData.get("duration")) : undefined,
  };

  const result = serviceSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { fieldErrors };
  }

  const maxOrder = await prisma.service.findFirst({
    where: { profileId: user.profileId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  await prisma.service.create({
    data: {
      ...result.data,
      profileId: user.profileId,
      sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath("/dashboard/servicos");
  return { success: true };
}

export async function updateServiceAction(
  serviceId: string,
  _prev: ServiceState,
  formData: FormData
): Promise<ServiceState> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { profileId: true },
  });

  if (!service || service.profileId !== user.profileId) {
    return { error: "Serviço não encontrado." };
  }

  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    priceMin: formData.get("priceMin") ? Number(formData.get("priceMin")) : undefined,
    priceMax: formData.get("priceMax") ? Number(formData.get("priceMax")) : undefined,
    duration: formData.get("duration") ? Number(formData.get("duration")) : undefined,
  };

  const result = serviceSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { fieldErrors };
  }

  await prisma.service.update({
    where: { id: serviceId },
    data: result.data,
  });

  revalidatePath("/dashboard/servicos");
  return { success: true };
}

export async function deleteServiceAction(serviceId: string): Promise<{ error?: string }> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { profileId: true },
  });

  if (!service || service.profileId !== user.profileId) {
    return { error: "Serviço não encontrado." };
  }

  await prisma.service.delete({ where: { id: serviceId } });
  revalidatePath("/dashboard/servicos");
  return {};
}

export async function toggleServiceAction(
  serviceId: string,
  isActive: boolean
): Promise<{ error?: string }> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { profileId: true },
  });

  if (!service || service.profileId !== user.profileId) {
    return { error: "Serviço não encontrado." };
  }

  await prisma.service.update({
    where: { id: serviceId },
    data: { isActive },
  });

  revalidatePath("/dashboard/servicos");
  return {};
}

export async function reorderServicesAction(
  orderedIds: string[]
): Promise<{ error?: string }> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.service.updateMany({
        where: { id, profileId: user.profileId! },
        data: { sortOrder: index },
      })
    )
  );

  revalidatePath("/dashboard/servicos");
  return {};
}
