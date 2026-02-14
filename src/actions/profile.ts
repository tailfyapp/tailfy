"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { profileSchema } from "@/lib/validators";

export type ProfileState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const raw = {
    slug: formData.get("slug") as string,
    businessName: formData.get("businessName") as string,
    ownerName: (formData.get("ownerName") as string) || undefined,
    bio: (formData.get("bio") as string) || undefined,
    phone: (formData.get("phone") as string) || undefined,
    whatsapp: (formData.get("whatsapp") as string) || undefined,
    instagram: (formData.get("instagram") as string) || undefined,
    address: (formData.get("address") as string) || undefined,
    city: (formData.get("city") as string) || undefined,
    state: (formData.get("state") as string) || undefined,
  };

  const result = profileSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { fieldErrors };
  }

  // Check slug uniqueness (excluding own profile)
  const existingSlug = await prisma.profile.findUnique({
    where: { slug: result.data.slug },
    select: { id: true },
  });

  if (existingSlug && existingSlug.id !== user.profileId) {
    return { fieldErrors: { slug: ["Este slug já está em uso."] } };
  }

  await prisma.profile.update({
    where: { id: user.profileId },
    data: result.data,
  });

  revalidatePath("/dashboard/perfil");
  revalidatePath(`/${result.data.slug}`);
  return { success: true };
}

export type OpeningHoursState = { success?: boolean; error?: string } | null;

export async function updateOpeningHoursAction(
  _prev: OpeningHoursState,
  formData: FormData
): Promise<OpeningHoursState> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const hoursJson = formData.get("openingHours") as string;

  try {
    const openingHours = JSON.parse(hoursJson);

    await prisma.profile.update({
      where: { id: user.profileId },
      data: { openingHours },
    });

    const profile = await prisma.profile.findUnique({
      where: { id: user.profileId },
      select: { slug: true },
    });

    revalidatePath("/dashboard/perfil");
    if (profile) revalidatePath(`/${profile.slug}`);
    return { success: true };
  } catch {
    return { error: "Dados de horário inválidos." };
  }
}
