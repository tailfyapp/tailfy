import { Clock, Scissors } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDuration } from "@/lib/utils";
import type { Service } from "@/generated/prisma/client";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
          <Scissors size={20} className="text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900">{service.name}</h3>
            <span className="text-sm font-bold text-purple-600 whitespace-nowrap">
              {formatPrice(service.priceMin, service.priceMax)}
            </span>
          </div>
          {service.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {service.description}
            </p>
          )}
          {service.duration && (
            <Badge variant="default" className="mt-2">
              <Clock size={14} className="mr-1" />
              {formatDuration(service.duration)}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
