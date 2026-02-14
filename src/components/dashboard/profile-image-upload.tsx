"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { ImageUploader } from "./image-uploader";
import { toast } from "sonner";

interface ProfileImageUploadProps {
  avatarUrl: string | null;
  coverUrl: string | null;
  businessName: string;
  profileId: string;
}

async function updateProfileImage(profileId: string, field: "avatarUrl" | "coverUrl", url: string) {
  const res = await fetch("/api/upload/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileId, field, url }),
  });
  return res.ok;
}

export function ProfileImageUpload({
  avatarUrl,
  coverUrl,
  businessName,
  profileId,
}: ProfileImageUploadProps) {
  const [avatar, setAvatar] = useState(avatarUrl);
  const [cover, setCover] = useState(coverUrl);

  const handleAvatarUpload = async (url: string) => {
    const ok = await updateProfileImage(profileId, "avatarUrl", url);
    if (ok) {
      setAvatar(url);
      toast.success("Foto de perfil atualizada!");
    } else {
      toast.error("Erro ao atualizar foto.");
    }
  };

  const handleCoverUpload = async (url: string) => {
    const ok = await updateProfileImage(profileId, "coverUrl", url);
    if (ok) {
      setCover(url);
      toast.success("Capa atualizada!");
    } else {
      toast.error("Erro ao atualizar capa.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Cover */}
      <div className="relative h-40 bg-linear-to-r from-purple-600 to-blue-500">
        {cover && (
          <Image src={cover} alt="Capa" fill className="object-cover" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageUploader
            folder="cover"
            onUpload={handleCoverUpload}
            maxSizeMB={5}
            className="!border-0 !p-0 !bg-transparent"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full text-white text-sm hover:bg-black/60 transition-colors">
              <Camera size={16} />
              Trocar capa
            </div>
          </ImageUploader>
        </div>
      </div>

      {/* Avatar */}
      <div className="px-6 pb-6 -mt-10 relative z-10">
        <div className="flex items-end gap-4">
          <div className="relative w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 shrink-0">
            {avatar ? (
              <Image
                src={avatar}
                alt={businessName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 text-2xl font-bold">
                {businessName.charAt(0)}
              </div>
            )}
          </div>
          <ImageUploader
            folder="avatar"
            onUpload={handleAvatarUpload}
            maxSizeMB={2}
            className="!border-0 !p-0 !bg-transparent flex-1"
          >
            <div className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium cursor-pointer">
              <Camera size={16} />
              Trocar foto de perfil
            </div>
          </ImageUploader>
        </div>
      </div>
    </div>
  );
}
