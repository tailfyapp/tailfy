"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, Pencil, Trash2, Plus, PawPrint, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ClientForm } from "./client-form";
import { PetForm } from "./pet-form";
import { deleteClientAction } from "@/actions/clients";
import { deletePetAction } from "@/actions/pets";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import type { Client, Pet, Appointment, Service } from "@/generated/prisma/client";

type ClientWithRelations = Client & {
  pets: Pet[];
  appointments: (Appointment & { service: Service })[];
};

const PET_SIZE_LABELS: Record<string, string> = {
  SMALL: "Pequeno",
  MEDIUM: "Médio",
  LARGE: "Grande",
  EXTRA_LARGE: "Extra Grande",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
  NO_SHOW: "Não compareceu",
};

const STATUS_VARIANTS: Record<string, "default" | "success" | "warning" | "info"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  CANCELLED: "default",
  NO_SHOW: "default",
};

interface ClientDetailProps {
  client: ClientWithRelations;
}

export function ClientDetail({ client }: ClientDetailProps) {
  const router = useRouter();
  const [editingClient, setEditingClient] = useState(false);
  const [showAddPet, setShowAddPet] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const handleDeleteClient = async () => {
    if (!confirm("Tem certeza que deseja excluir este cliente e todos os seus pets?")) return;
    const result = await deleteClientAction(client.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Cliente excluído!");
      router.push("/dashboard/clientes");
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (!confirm("Excluir este pet?")) return;
    const result = await deletePetAction(petId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Pet removido!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            {client.phone && (
              <span className="flex items-center gap-1">
                <Phone size={14} />
                {client.phone}
              </span>
            )}
            {client.email && (
              <span className="flex items-center gap-1">
                <Mail size={14} />
                {client.email}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="text-sm" onClick={() => setEditingClient(true)}>
            <Pencil size={14} />
            Editar
          </Button>
          <Button variant="ghost" className="text-sm text-red-600 hover:bg-red-50" onClick={handleDeleteClient}>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {client.notes && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-600">{client.notes}</p>
        </div>
      )}

      {/* Pets */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <PawPrint size={18} className="text-gray-400" />
            Pets ({client.pets.length})
          </h2>
          <Button onClick={() => setShowAddPet(true)} className="text-sm" variant="secondary">
            <Plus size={14} />
            Novo pet
          </Button>
        </div>

        {client.pets.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Nenhum pet cadastrado.
          </p>
        ) : (
          <div className="space-y-3">
            {client.pets.map((pet) => (
              <div key={pet.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
                <div>
                  <p className="font-medium text-gray-900">{pet.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {pet.breed && <span>{pet.breed}</span>}
                    {pet.size && <Badge>{PET_SIZE_LABELS[pet.size]}</Badge>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingPet(pet)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <Pencil size={14} className="text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDeletePet(pet.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment history */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-gray-400" />
          Histórico de agendamentos
        </h2>

        {client.appointments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Nenhum agendamento registrado.
          </p>
        ) : (
          <div className="space-y-3">
            {client.appointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
                <div>
                  <p className="font-medium text-gray-900">{apt.service.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(apt.startTime).toLocaleDateString("pt-BR")} às{" "}
                    {new Date(apt.startTime).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {apt.price && (
                    <span className="text-sm font-medium text-purple-600">
                      {formatPrice(apt.price)}
                    </span>
                  )}
                  <Badge variant={STATUS_VARIANTS[apt.status]}>
                    {STATUS_LABELS[apt.status]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal open={editingClient} onClose={() => setEditingClient(false)} title="Editar cliente">
        <ClientForm client={client} onSuccess={() => setEditingClient(false)} />
      </Modal>

      <Modal open={showAddPet} onClose={() => setShowAddPet(false)} title="Novo pet">
        <PetForm clientId={client.id} onSuccess={() => setShowAddPet(false)} />
      </Modal>

      <Modal open={!!editingPet} onClose={() => setEditingPet(null)} title="Editar pet">
        {editingPet && (
          <PetForm
            clientId={client.id}
            pet={editingPet}
            onSuccess={() => setEditingPet(null)}
          />
        )}
      </Modal>
    </div>
  );
}
