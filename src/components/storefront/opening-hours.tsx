import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDayLabel, getOrderedDays, isOpenNow } from "@/lib/utils";
import type { OpeningHours as OpeningHoursType } from "@/types";

interface OpeningHoursProps {
  openingHours?: OpeningHoursType | null;
}

export function OpeningHours({ openingHours }: OpeningHoursProps) {
  if (!openingHours) return null;

  const isOpen = isOpenNow(openingHours);
  const days = getOrderedDays();

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Clock size={20} className="text-gray-400" />
          Horários
        </h2>
        <Badge variant={isOpen ? "success" : "warning"}>
          {isOpen ? "Aberto agora" : "Fechado"}
        </Badge>
      </div>
      <div className="space-y-2">
        {days.map((day) => {
          const schedule = openingHours[day];
          return (
            <div
              key={day}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-600 font-medium">
                {getDayLabel(day)}
              </span>
              {schedule ? (
                <span className="text-gray-900">
                  {schedule.open} - {schedule.close}
                </span>
              ) : (
                <span className="text-gray-400">Fechado</span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
