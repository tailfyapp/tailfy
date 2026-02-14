"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAppointmentAction, getAvailableSlotsAction, type AppointmentState } from "@/actions/appointments";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Client, Service } from "@/generated/prisma/client";

interface AppointmentFormProps {
  clients: Client[];
  services: Service[];
  profileId: string;
}

export function AppointmentForm({ clients, services, profileId }: AppointmentFormProps) {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [state, formAction, isPending] = useActionState<AppointmentState, FormData>(
    createAppointmentAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Agendamento criado!");
      router.push("/dashboard/agendamentos");
    }
  }, [state, router]);

  useEffect(() => {
    if (selectedService && selectedDate) {
      setLoadingSlots(true);
      getAvailableSlotsAction(profileId, selectedDate, selectedService).then(
        (slots) => {
          setAvailableSlots(slots);
          setSelectedSlot("");
          setLoadingSlots(false);
        }
      );
    }
  }, [selectedService, selectedDate, profileId]);

  const startTimeValue =
    selectedDate && selectedSlot ? `${selectedDate}T${selectedSlot}:00` : "";

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3">
          {state.error}
        </div>
      )}

      <Select
        id="clientId"
        name="clientId"
        label="Cliente"
        required
        error={state?.fieldErrors?.clientId?.[0]}
      >
        <option value="">Selecione um cliente...</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select
        id="serviceId"
        name="serviceId"
        label="Serviço"
        required
        value={selectedService}
        onChange={(e) => setSelectedService(e.target.value)}
        error={state?.fieldErrors?.serviceId?.[0]}
      >
        <option value="">Selecione um serviço...</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} {s.duration ? `(${s.duration}min)` : ""}
          </option>
        ))}
      </Select>

      <Input
        id="date"
        label="Data"
        type="date"
        required
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        min={new Date().toISOString().split("T")[0]}
      />

      {selectedDate && selectedService && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Horário
          </label>
          {loadingSlots ? (
            <p className="text-sm text-gray-400">Carregando horários...</p>
          ) : availableSlots.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum horário disponível nesta data.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    selectedSlot === slot
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <input type="hidden" name="startTime" value={startTimeValue} />

      <Input
        id="price"
        name="price"
        label="Preço (R$)"
        type="number"
        step="0.01"
        min="0"
      />

      <Textarea
        id="notes"
        name="notes"
        label="Observações"
        rows={3}
      />

      <Button
        type="submit"
        disabled={isPending || !startTimeValue}
        className="w-full"
      >
        {isPending ? "Criando..." : "Criar agendamento"}
      </Button>
    </form>
  );
}
