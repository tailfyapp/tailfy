import { getUserProfile } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Scissors, Users, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const profile = await getUserProfile();

  const [serviceCount, clientCount, appointmentCount] = await Promise.all([
    prisma.service.count({ where: { profileId: profile.id } }),
    prisma.client.count({ where: { profileId: profile.id } }),
    prisma.appointment.count({ where: { profileId: profile.id } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {profile.ownerName || profile.businessName}!
        </h1>
        <p className="text-gray-500 mt-1">
          Aqui está um resumo do seu negócio.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatsCard icon={Scissors} label="Serviços" value={serviceCount} />
        <StatsCard icon={Users} label="Clientes" value={clientCount} />
        <StatsCard icon={Calendar} label="Agendamentos" value={appointmentCount} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/agendamentos/novo">
            <Button className="text-sm">
              <Plus size={16} />
              Novo agendamento
            </Button>
          </Link>
          <Link href="/dashboard/clientes/novo">
            <Button variant="secondary" className="text-sm">
              <Plus size={16} />
              Novo cliente
            </Button>
          </Link>
          <Link href="/dashboard/servicos">
            <Button variant="secondary" className="text-sm">
              <Scissors size={16} />
              Gerenciar serviços
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
