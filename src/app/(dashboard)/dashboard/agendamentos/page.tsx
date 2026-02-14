import { getUserProfile } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { AppointmentList } from "@/components/dashboard/appointment-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { startOfWeek, endOfWeek } from "date-fns";

interface PageProps {
  searchParams: Promise<{ date?: string; status?: string }>;
}

export default async function AgendamentosPage({ searchParams }: PageProps) {
  const { date, status } = await searchParams;
  const profile = await getUserProfile();

  const baseDate = date ? new Date(date) : new Date();
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(baseDate, { weekStartsOn: 1 });

  const where = {
    profileId: profile.id,
    startTime: { gte: weekStart, lte: weekEnd },
    ...(status && status !== "ALL" && { status: status as never }),
  };

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      client: true,
      service: true,
    },
    orderBy: { startTime: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-500 mt-1">
            {appointments.length} agendamento{appointments.length !== 1 ? "s" : ""} esta semana
          </p>
        </div>
        <Link href="/dashboard/agendamentos/novo">
          <Button className="text-sm">
            <Plus size={16} />
            Novo agendamento
          </Button>
        </Link>
      </div>

      <AppointmentList
        appointments={appointments}
        currentDate={baseDate.toISOString()}
      />
    </div>
  );
}
