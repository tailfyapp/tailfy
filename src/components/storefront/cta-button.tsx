import { MessageCircle } from "lucide-react";
import { formatWhatsAppUrl } from "@/lib/utils";

interface CtaButtonProps {
  whatsapp?: string | null;
  businessName?: string;
}

export function CtaButton({ whatsapp, businessName }: CtaButtonProps) {
  if (!whatsapp) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 sm:hidden">
      <a
        href={formatWhatsAppUrl(whatsapp, businessName)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200 w-full max-w-sm justify-center"
      >
        <MessageCircle size={22} />
        Agendar pelo WhatsApp
      </a>
    </div>
  );
}

export function CtaButtonDesktop({
  whatsapp,
  businessName,
}: CtaButtonProps) {
  if (!whatsapp) return null;

  return (
    <a
      href={formatWhatsAppUrl(whatsapp, businessName)}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden sm:inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-8 py-4 shadow-sm hover:shadow-md transition-all duration-200 w-full justify-center"
    >
      <MessageCircle size={22} />
      Agendar pelo WhatsApp
    </a>
  );
}
