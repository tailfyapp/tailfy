"use client";

import { useActionState, useState, useEffect } from "react";
import { updateOpeningHoursAction, type OpeningHoursState } from "@/actions/profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getDayLabel, getOrderedDays } from "@/lib/utils";
import { toast } from "sonner";
import type { OpeningHours } from "@/types";

interface OpeningHoursEditorProps {
  openingHours: OpeningHours;
}

export function OpeningHoursEditor({ openingHours }: OpeningHoursEditorProps) {
  const days = getOrderedDays();
  const [hours, setHours] = useState<OpeningHours>(openingHours);

  const [state, formAction, isPending] = useActionState<OpeningHoursState, FormData>(
    updateOpeningHoursAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Horários atualizados!");
    }
  }, [state]);

  const toggleDay = (day: string) => {
    setHours((prev) => ({
      ...prev,
      [day]: prev[day] ? null : { open: "09:00", close: "18:00" },
    }));
  };

  const updateTime = (day: string, field: "open" | "close", value: string) => {
    setHours((prev) => ({
      ...prev,
      [day]: prev[day] ? { ...prev[day]!, [field]: value } : null,
    }));
  };

  return (
    <form
      action={(formData) => {
        formData.set("openingHours", JSON.stringify(hours));
        formAction(formData);
      }}
      className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
    >
      <h2 className="font-semibold text-gray-900">Horários de funcionamento</h2>

      {state?.error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3">
          {state.error}
        </div>
      )}

      <div className="space-y-3">
        {days.map((day) => {
          const schedule = hours[day];
          const isOpen = !!schedule;

          return (
            <div key={day} className="flex items-center gap-3">
              <label className="flex items-center gap-2 w-28 shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOpen}
                  onChange={() => toggleDay(day)}
                  className="rounded accent-purple-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  {getDayLabel(day)}
                </span>
              </label>

              {isOpen ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={schedule!.open}
                    onChange={(e) => updateTime(day, "open", e.target.value)}
                    className="w-32 text-sm py-2"
                  />
                  <span className="text-gray-400">—</span>
                  <Input
                    type="time"
                    value={schedule!.close}
                    onChange={(e) => updateTime(day, "close", e.target.value)}
                    className="w-32 text-sm py-2"
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-400">Fechado</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar horários"}
        </Button>
      </div>
    </form>
  );
}
