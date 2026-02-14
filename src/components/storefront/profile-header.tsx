import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Profile } from "@/generated/prisma/client";

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Cover */}
      <div className="h-48 sm:h-56 bg-linear-to-r from-purple-600 to-blue-500 rounded-b-3xl overflow-hidden relative">
        {profile.coverUrl && (
          <Image
            src={profile.coverUrl}
            alt={`Capa de ${profile.businessName}`}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Avatar + Info */}
      <div className="px-4 sm:px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm p-6 pt-16 relative">
          {/* Avatar */}
          <div className="absolute -top-12 left-6">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.businessName}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 text-2xl font-bold">
                  {profile.businessName.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <h1 className="text-2xl font-bold text-gray-900">
            {profile.businessName}
          </h1>
          {profile.ownerName && (
            <p className="text-sm text-gray-500 mt-1">
              por {profile.ownerName}
            </p>
          )}
          {profile.bio && (
            <p className="text-gray-600 mt-3 leading-relaxed">{profile.bio}</p>
          )}
          {(profile.city || profile.state) && (
            <div className="flex items-center gap-1 mt-3 text-sm text-gray-500">
              <MapPin size={16} />
              <span>
                {[profile.city, profile.state].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
