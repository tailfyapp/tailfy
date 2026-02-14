"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, addWeeks, subWeeks, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AppointmentCard } from "./appointment-card";
import type { Appointment, Client, Service } from "@/generated/prisma/client";

type AppointmentWithRelations = Appointment & {
  client: Client;
  service: Service;
};

interface AppointmentListProps {
  appointments: AppointmentWithRelations[];
  currentDate: string;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "Todos" },
  { value: "PENDING", label: "Pendente" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "COMPLETED", label: "Concluído" },
  { value: "CANCELLED", label: "Cancelado" },
];

export function AppointmentList({ appointments, currentDate }: AppointmentListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";
  const baseDate = new Date(currentDate);
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });

  const navigate = (date: Date, status?: string) => {
    const params = new URLSearchParams();
    params.set("date", format(date, "yyyy-MM-dd"));
    if (status && status !== "ALL") params.set("status", status);
    router.push(`/dashboard/agendamentos?${params.toString()}`);
  };

  // Group by day
  const grouped: Record<string, AppointmentWithRelations[]> = {};
  appointments.forEach((apt) => {
    const key = format(new Date(apt.startTime), "yyyy-MM-dd");
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(apt);
  });

  return (
    <div className="space-y-4">
      {/* Week navigator */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm p-4">
        <button
          onClick={() => navigate(subWeeks(baseDate, 1), currentStatus)}
          className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <div className="text-center">
          <p className="font-semibold text-gray-900">
            {format(weekStart, "dd MMM", { locale: ptBR })} —{" "}
            {format(addWeeks(weekStart, 1), "dd MMM yyyy", { locale: ptBR })}
          </p>
        </div>
        <button
          onClick={() => navigate(addWeeks(baseDate, 1), currentStatus)}
          className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => navigate(baseDate, opt.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
              currentStatus === opt.value
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Appointments */}
      {appointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Nenhum agendamento"
          description="Não há agendamentos para este período."
        />
      ) : (
        Object.keys(grouped)
          .sort()
          .map((day) => (
            <div key={day}>
              <h3 className="text-sm font-semibold text-gray-500 mb-2 capitalize">
                {format(new Date(day + "T12:00:00"), "EEEE, dd 'de' MMMM", {
                  locale: ptBR,
                })}
              </h3>
              <div className="space-y-2">
                {grouped[day].map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  );
}
