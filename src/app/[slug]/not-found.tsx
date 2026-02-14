import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SlugNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-6">
          <Search size={32} className="text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Perfil não encontrado
        </h1>
        <p className="text-gray-500 mb-8">
          Não encontramos nenhum profissional com esse endereço.
          Verifique se o link está correto.
        </p>
        <Link href="/">
          <Button>Voltar ao início</Button>
        </Link>
      </div>
    </div>
  );
}
