import { notFound } from "next/navigation";
import { getUserProfile } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { ClientDetail } from "@/components/dashboard/client-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClienteDetailPage({ params }: PageProps) {
  const { id } = await params;
  const profile = await getUserProfile();

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      pets: { orderBy: { name: "asc" } },
      appointments: {
        include: { service: true },
        orderBy: { startTime: "desc" },
        take: 10,
      },
    },
  });

  if (!client || client.profileId !== profile.id) {
    notFound();
  }

  return <ClientDetail client={client} />;
}
