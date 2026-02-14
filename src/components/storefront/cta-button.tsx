import { MessageCircle, Calendar } from "lucide-react";
import { formatWhatsAppUrl } from "@/lib/utils";
import Link from "next/link";

interface CtaButtonProps {
  whatsapp?: string | null;
  businessName?: string;
  slug?: string;
}

export function CtaButton({ whatsapp, businessName, slug }: CtaButtonProps) {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 sm:hidden">
      <div className="flex gap-2 w-full max-w-sm">
        {slug && (
          <Link
            href={`/${slug}/agendar`}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-200 flex-1 justify-center"
          >
            <Calendar size={20} />
            Agendar
          </Link>
        )}
        {whatsapp && (
          <a
            href={formatWhatsAppUrl(whatsapp, businessName)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-200 flex-1 justify-center"
          >
            <MessageCircle size={20} />
            WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

export function CtaButtonDesktop({
  whatsapp,
  businessName,
  slug,
}: CtaButtonProps) {
  return (
    <div className="hidden sm:flex gap-3">
      {slug && (
        <Link
          href={`/${slug}/agendar`}
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full px-8 py-4 shadow-sm hover:shadow-md transition-all duration-200 flex-1 justify-center"
        >
          <Calendar size={22} />
          Agendar online
        </Link>
      )}
      {whatsapp && (
        <a
          href={formatWhatsAppUrl(whatsapp, businessName)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-8 py-4 shadow-sm hover:shadow-md transition-all duration-200 flex-1 justify-center"
        >
          <MessageCircle size={22} />
          WhatsApp
        </a>
      )}
    </div>
  );
}
