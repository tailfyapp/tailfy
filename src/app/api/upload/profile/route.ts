import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.profileId) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { field, url } = await req.json();

  if (!["avatarUrl", "coverUrl"].includes(field) || typeof url !== "string") {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const profile = await prisma.profile.findUnique({
    where: { id: session.user.profileId },
    select: { id: true, slug: true },
  });

  if (!profile) {
    return NextResponse.json({ error: "Perfil não encontrado." }, { status: 404 });
  }

  await prisma.profile.update({
    where: { id: profile.id },
    data: { [field]: url },
  });

  revalidatePath("/dashboard/perfil");
  revalidatePath(`/${profile.slug}`);

  return NextResponse.json({ success: true });
}
