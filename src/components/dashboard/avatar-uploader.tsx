"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { ImageUploader } from "./image-uploader";

interface AvatarUploaderProps {
  currentUrl?: string | null;
  businessName: string;
  onUpload: (url: string) => void;
}

export function AvatarUploader({ currentUrl, businessName, onUpload }: AvatarUploaderProps) {
  const [url, setUrl] = useState(currentUrl);

  const handleUpload = (newUrl: string) => {
    setUrl(newUrl);
    onUpload(newUrl);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 shrink-0">
        {url ? (
          <Image
            src={url}
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
        onUpload={handleUpload}
        maxSizeMB={2}
        className="flex-1"
      >
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Camera size={16} />
          <span>Trocar foto de perfil</span>
        </div>
      </ImageUploader>
    </div>
  );
}
