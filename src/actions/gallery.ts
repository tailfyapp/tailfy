"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function addGalleryImageAction(
  url: string,
  caption?: string
): Promise<{ error?: string }> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  if (!url || !url.startsWith("http")) {
    return { error: "URL inválida." };
  }

  const maxOrder = await prisma.galleryImage.findFirst({
    where: { profileId: user.profileId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  await prisma.galleryImage.create({
    data: {
      profileId: user.profileId,
      url,
      caption: caption || null,
      sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath("/dashboard/galeria");
  return {};
}

export async function deleteGalleryImageAction(
  imageId: string
): Promise<{ error?: string }> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const image = await prisma.galleryImage.findUnique({
    where: { id: imageId },
    select: { profileId: true },
  });

  if (!image || image.profileId !== user.profileId) {
    return { error: "Imagem não encontrada." };
  }

  await prisma.galleryImage.delete({ where: { id: imageId } });
  revalidatePath("/dashboard/galeria");
  return {};
}

export async function reorderGalleryAction(
  orderedIds: string[]
): Promise<{ error?: string }> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.galleryImage.updateMany({
        where: { id, profileId: user.profileId! },
        data: { sortOrder: index },
      })
    )
  );

  revalidatePath("/dashboard/galeria");
  return {};
}
