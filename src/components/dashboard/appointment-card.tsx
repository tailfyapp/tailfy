"use client";

import { format } from "date-fns";
import { Clock, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { updateAppointmentStatusAction } from "@/actions/appointments";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import type { Appointment, Client, Service, AppointmentStatus } from "@/generated/prisma/client";

type AppointmentWithRelations = Appointment & {
  client: Client;
  service: Service;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "success" | "warning" | "info"; color: string }
> = {
  PENDING: { label: "Pendente", variant: "warning", color: "border-l-yellow-400" },
  CONFIRMED: { label: "Confirmado", variant: "info", color: "border-l-blue-400" },
  IN_PROGRESS: { label: "Em andamento", variant: "info", color: "border-l-purple-400" },
  COMPLETED: { label: "Concluído", variant: "success", color: "border-l-green-400" },
  CANCELLED: { label: "Cancelado", variant: "default", color: "border-l-gray-400" },
  NO_SHOW: { label: "Não compareceu", variant: "default", color: "border-l-red-400" },
};

const STATUS_TRANSITIONS: Record<string, { value: AppointmentStatus; label: string }[]> = {
  PENDING: [
    { value: "CONFIRMED", label: "Confirmar" },
    { value: "CANCELLED", label: "Cancelar" },
  ],
  CONFIRMED: [
    { value: "IN_PROGRESS", label: "Iniciar" },
    { value: "CANCELLED", label: "Cancelar" },
    { value: "NO_SHOW", label: "Não compareceu" },
  ],
  IN_PROGRESS: [
    { value: "COMPLETED", label: "Concluir" },
  ],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

interface AppointmentCardProps {
  appointment: AppointmentWithRelations;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const config = STATUS_CONFIG[appointment.status];
  const transitions = STATUS_TRANSITIONS[appointment.status] ?? [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (status: AppointmentStatus) => {
    setMenuOpen(false);
    const result = await updateAppointmentStatusAction(appointment.id, status);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Status atualizado!");
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm p-4 border-l-4 ${config.color}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">
              {appointment.client.name}
            </span>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
          <p className="text-sm text-gray-600">{appointment.service.name}</p>
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {format(new Date(appointment.startTime), "HH:mm")} —{" "}
              {format(new Date(appointment.endTime), "HH:mm")}
            </span>
            {appointment.price && (
              <span className="font-medium text-purple-600">
                {formatPrice(appointment.price)}
              </span>
            )}
          </div>
          {appointment.notes && (
            <p className="text-xs text-gray-400 mt-1">{appointment.notes}</p>
          )}
        </div>

        {transitions.length > 0 && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
            >
              <MoreVertical size={16} className="text-gray-400" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10">
                {transitions.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => handleStatusChange(t.value)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
