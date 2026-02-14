"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { ImageUploader } from "./image-uploader";
import { addGalleryImageAction, deleteGalleryImageAction } from "@/actions/gallery";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";
import type { GalleryImage } from "@/generated/prisma/client";

interface GalleryUploaderProps {
  images: GalleryImage[];
}

export function GalleryUploader({ images }: GalleryUploaderProps) {
  const [showUpload, setShowUpload] = useState(false);

  const handleUpload = async (url: string) => {
    const result = await addGalleryImageAction(url);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Imagem adicionada!");
      setShowUpload(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Excluir esta imagem?")) return;
    const result = await deleteGalleryImageAction(imageId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Imagem removida!");
    }
  };

  if (images.length === 0 && !showUpload) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="Nenhuma imagem na galeria"
        description="Faça upload de fotos dos seus trabalhos."
        actionLabel="Adicionar imagem"
        onAction={() => setShowUpload(true)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <div className="aspect-square rounded-xl overflow-hidden">
              <Image
                src={image.url}
                alt={image.caption ?? "Galeria"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
            <button
              onClick={() => handleDelete(image.id)}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 cursor-pointer"
            >
              <Trash2 size={14} className="text-red-500" />
            </button>
          </div>
        ))}

        {/* Add button */}
        <button
          onClick={() => setShowUpload(true)}
          className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-500 transition-colors cursor-pointer"
        >
          <Plus size={24} />
          <span className="text-xs">Adicionar</span>
        </button>
      </div>

      {showUpload && (
        <ImageUploader
          folder="gallery"
          onUpload={handleUpload}
          maxSizeMB={5}
        />
      )}
    </div>
  );
}
