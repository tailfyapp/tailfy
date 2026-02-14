"use client";

import { useState } from "react";
import { Plus, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { ServiceForm } from "./service-form";
import { ServiceItem } from "./service-item";
import type { Service } from "@/generated/prisma/client";

interface ServiceManagerProps {
  services: Service[];
}

export function ServiceManager({ services }: ServiceManagerProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  return (
    <>
      {services.length === 0 ? (
        <EmptyState
          icon={Scissors}
          title="Nenhum serviço cadastrado"
          description="Adicione seus serviços para que seus clientes possam conhecê-los."
          actionLabel="Adicionar serviço"
          onAction={() => setShowCreate(true)}
        />
      ) : (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setShowCreate(true)} className="text-sm">
              <Plus size={16} />
              Novo serviço
            </Button>
          </div>

          <div className="space-y-3">
            {services.map((service) => (
              <ServiceItem
                key={service.id}
                service={service}
                onEdit={() => setEditingService(service)}
              />
            ))}
          </div>
        </>
      )}

      {/* Create Modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Novo serviço"
      >
        <ServiceForm onSuccess={() => setShowCreate(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editingService}
        onClose={() => setEditingService(null)}
        title="Editar serviço"
      >
        {editingService && (
          <ServiceForm
            service={editingService}
            onSuccess={() => setEditingService(null)}
          />
        )}
      </Modal>
    </>
  );
}
