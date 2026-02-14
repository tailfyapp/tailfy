import { getUserProfile } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { AppointmentForm } from "@/components/dashboard/appointment-form";

export default async function NovoAgendamentoPage() {
  const profile = await getUserProfile();

  const [clients, services] = await Promise.all([
    prisma.client.findMany({
      where: { profileId: profile.id },
      orderBy: { name: "asc" },
    }),
    prisma.service.findMany({
      where: { profileId: profile.id, isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Novo agendamento</h1>
        <p className="text-gray-500 mt-1">
          Agende um serviço para um cliente.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <AppointmentForm
          clients={clients}
          services={services}
          profileId={profile.id}
        />
      </div>
    </div>
  );
}
