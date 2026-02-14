import { ServiceCard } from "./service-card";
import type { Service } from "@/generated/prisma/client";

interface ServiceListProps {
  services: Service[];
}

export function ServiceList({ services }: ServiceListProps) {
  const activeServices = services
    .filter((s) => s.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (activeServices.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Serviços</h2>
      <div className="space-y-3">
        {activeServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
