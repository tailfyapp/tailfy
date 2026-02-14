import { getUserProfile } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, Plus, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { ClientSearch } from "@/components/dashboard/client-search";

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function ClientesPage({ searchParams }: PageProps) {
  const { page, q } = await searchParams;
  const profile = await getUserProfile();
  const currentPage = Math.max(1, Number(page) || 1);

  const where = {
    profileId: profile.id,
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { phone: { contains: q } },
        { email: { contains: q, mode: "insensitive" as const } },
      ],
    }),
  };

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      include: { _count: { select: { pets: true } } },
      orderBy: { name: "asc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.client.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">{total} cliente{total !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/dashboard/clientes/novo">
          <Button className="text-sm">
            <Plus size={16} />
            Novo cliente
          </Button>
        </Link>
      </div>

      <ClientSearch />

      {clients.length === 0 && !q ? (
        <EmptyState
          icon={Users}
          title="Nenhum cliente cadastrado"
          description="Cadastre seus clientes para gerenciar agendamentos."
          actionLabel="Cadastrar cliente"
        />
      ) : clients.length === 0 && q ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          Nenhum cliente encontrado para &quot;{q}&quot;.
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`/dashboard/clientes/${client.id}`}
                className="block bg-white rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
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
                  <span className="text-sm text-gray-400">
                    {client._count.pets} pet{client._count.pets !== 1 ? "s" : ""}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/dashboard/clientes"
          />
        </>
      )}
    </div>
  );
}
