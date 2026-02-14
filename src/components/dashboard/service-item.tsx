"use client";

import { Pencil, Trash2 } from "lucide-react";
import { formatPrice, formatDuration } from "@/lib/utils";
import { deleteServiceAction, toggleServiceAction } from "@/actions/services";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Service } from "@/generated/prisma/client";

interface ServiceItemProps {
  service: Service;
  onEdit: () => void;
}

export function ServiceItem({ service, onEdit }: ServiceItemProps) {
  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;
    const result = await deleteServiceAction(service.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Serviço excluído!");
    }
  };

  const handleToggle = async () => {
    const result = await toggleServiceAction(service.id, !service.isActive);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(service.isActive ? "Serviço desativado" : "Serviço ativado");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 flex items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 truncate">{service.name}</h3>
          {!service.isActive && <Badge variant="warning">Inativo</Badge>}
        </div>
        {service.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
          <span className="font-medium text-purple-600">
            {formatPrice(service.priceMin, service.priceMax)}
          </span>
          {service.duration && (
            <span>{formatDuration(service.duration)}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleToggle}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          title={service.isActive ? "Desativar" : "Ativar"}
        >
          <div
            className={`w-8 h-5 rounded-full transition-colors ${
              service.isActive ? "bg-purple-600" : "bg-gray-300"
            } relative`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                service.isActive ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </div>
        </button>
        <button
          onClick={onEdit}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <Pencil size={16} className="text-gray-400" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 size={16} className="text-red-400" />
        </button>
      </div>
    </div>
  );
}
