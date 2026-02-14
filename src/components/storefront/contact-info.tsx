import { Phone, MapPin, Instagram } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatInstagramUrl } from "@/lib/utils";
import type { Profile } from "@/generated/prisma/client";

interface ContactInfoProps {
  profile: Profile;
}

export function ContactInfo({ profile }: ContactInfoProps) {
  const hasContact = profile.phone || profile.instagram || profile.address;
  if (!hasContact) return null;

  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Contato</h2>
      <div className="space-y-3">
        {profile.phone && (
          <a
            href={`tel:${profile.phone}`}
            className="flex items-center gap-3 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Phone size={20} className="text-gray-400" />
            <span>{profile.phone}</span>
          </a>
        )}
        {profile.instagram && (
          <a
            href={formatInstagramUrl(profile.instagram)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Instagram size={20} className="text-gray-400" />
            <span>@{profile.instagram.replace("@", "")}</span>
          </a>
        )}
        {profile.address && (
          <div className="flex items-start gap-3 text-gray-600">
            <MapPin size={20} className="text-gray-400 mt-0.5" />
            <span>{profile.address}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
