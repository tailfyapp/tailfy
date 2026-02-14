import { ClientFormPage } from "@/components/dashboard/client-form-page";

export default function NovoClientePage() {
  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Novo cliente</h1>
        <p className="text-gray-500 mt-1">
          Cadastre um novo cliente.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <ClientFormPage />
      </div>
    </div>
  );
}
