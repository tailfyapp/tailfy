import { getUserProfile } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { ServiceManager } from "@/components/dashboard/service-manager";

export default async function ServicosPage() {
  const profile = await getUserProfile();

  const services = await prisma.service.findMany({
    where: { profileId: profile.id },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
        <p className="text-gray-500 mt-1">
          Gerencie os serviços oferecidos pelo seu negócio.
        </p>
      </div>

      <ServiceManager services={services} />
    </div>
  );
}
