"use client";

import { useActionState, useEffect, useState } from "react";
import { createPublicBookingAction, getAvailableSlotsAction, type PublicBookingState } from "@/actions/appointments";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";
import type { Service } from "@/generated/prisma/client";

interface BookingFormProps {
  slug: string;
  profileId: string;
  services: Service[];
}

type Step = "service" | "datetime" | "info" | "confirm" | "success";

export function BookingForm({ slug, profileId, services }: BookingFormProps) {
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const action = createPublicBookingAction.bind(null, slug);
  const [state, formAction, isPending] = useActionState<PublicBookingState, FormData>(action, null);

  useEffect(() => {
    if (state?.success) {
      setStep("success");
    }
  }, [state]);

  useEffect(() => {
    if (selectedService && selectedDate) {
      setLoadingSlots(true);
      getAvailableSlotsAction(profileId, selectedDate, selectedService.id).then(
        (slots) => {
          setAvailableSlots(slots);
          setSelectedTime("");
          setLoadingSlots(false);
        }
      );
    }
  }, [selectedService, selectedDate, profileId]);

  if (step === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Agendamento solicitado!
        </h2>
        <p className="text-gray-500 mb-6">
          Seu agendamento foi enviado e está aguardando confirmação.
          Você receberá uma resposta em breve.
        </p>
        <Button onClick={() => window.location.reload()} variant="secondary">
          Fazer outro agendamento
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction}>
      {state?.error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4">
          {state.error}
        </div>
      )}

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {(["service", "datetime", "info"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s
                  ? "bg-purple-600 text-white"
                  : i < ["service", "datetime", "info"].indexOf(step)
                    ? "bg-purple-100 text-purple-600"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
            {i < 2 && <div className="w-8 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Step 1: Service */}
      {step === "service" && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 mb-3">
            Escolha o serviço
          </h3>
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => {
                setSelectedService(service);
                setStep("datetime");
              }}
              className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                selectedService?.id === service.id
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  {service.description && (
                    <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                  )}
                </div>
                <span className="text-sm font-bold text-purple-600 whitespace-nowrap ml-3">
                  {formatPrice(service.priceMin, service.priceMax)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === "datetime" && selectedService && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">
            Escolha data e horário
          </h3>
          <p className="text-sm text-gray-500">
            Serviço: <strong>{selectedService.name}</strong>
          </p>

          <Input
            id="date-picker"
            label="Data"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Horário disponível
              </label>
              {loadingSlots ? (
                <p className="text-sm text-gray-400">Carregando...</p>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-gray-400">
                  Nenhum horário disponível nesta data.
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                        selectedTime === slot
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

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep("service")}
              className="flex-1"
            >
              Voltar
            </Button>
            <Button
              type="button"
              disabled={!selectedTime}
              onClick={() => setStep("info")}
              className="flex-1"
            >
              Próximo
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Personal info */}
      {step === "info" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Seus dados</h3>

          <input type="hidden" name="serviceId" value={selectedService?.id ?? ""} />
          <input type="hidden" name="date" value={selectedDate} />
          <input type="hidden" name="time" value={selectedTime} />

          <Input
            id="clientName"
            name="clientName"
            label="Seu nome"
            required
            error={state?.fieldErrors?.clientName?.[0]}
          />
          <Input
            id="clientPhone"
            name="clientPhone"
            label="Telefone (WhatsApp)"
            required
            placeholder="(11) 99999-9999"
            error={state?.fieldErrors?.clientPhone?.[0]}
          />
          <Input
            id="clientEmail"
            name="clientEmail"
            type="email"
            label="Email (opcional)"
            error={state?.fieldErrors?.clientEmail?.[0]}
          />
          <Input
            id="petName"
            name="petName"
            label="Nome do pet (opcional)"
          />
          <Textarea
            id="notes"
            name="notes"
            label="Observações (opcional)"
            rows={2}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep("datetime")}
              className="flex-1"
            >
              Voltar
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Enviando..." : "Confirmar agendamento"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
