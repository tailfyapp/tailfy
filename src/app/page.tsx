import { Scissors, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-blue-500" />
        <div className="relative max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Tailfy
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            A vitrine digital para profissionais do mercado Pet.
            Mostre seus serviços, portfólio e receba agendamentos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button variant="secondary" className="text-lg px-8 py-4">
                Criar minha vitrine
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-lg px-8 py-4 text-white hover:bg-white/20">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Scissors size={24} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Serviços</h3>
            <p className="text-sm text-gray-500">
              Liste seus serviços com preços e duração estimada.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Star size={24} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Portfólio</h3>
            <p className="text-sm text-gray-500">
              Mostre seus melhores trabalhos em uma galeria bonita.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Clock size={24} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Agendamento</h3>
            <p className="text-sm text-gray-500">
              Receba agendamentos direto pelo WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Tailfy. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
