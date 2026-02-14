"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { addGalleryImageAction, deleteGalleryImageAction } from "@/actions/gallery";
import { toast } from "sonner";
import type { GalleryImage } from "@/generated/prisma/client";

interface GalleryManagerProps {
  images: GalleryImage[];
}

export function GalleryManager({ images }: GalleryManagerProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!url) return;
    setIsAdding(true);
    const result = await addGalleryImageAction(url, caption);
    setIsAdding(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Imagem adicionada!");
      setUrl("");
      setCaption("");
      setShowAdd(false);
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

  return (
    <>
      {images.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Nenhuma imagem na galeria"
          description="Adicione fotos dos seus trabalhos para atrair mais clientes."
          actionLabel="Adicionar imagem"
          onAction={() => setShowAdd(true)}
        />
      ) : (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setShowAdd(true)} className="text-sm">
              <Plus size={16} />
              Adicionar imagem
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.caption ?? "Imagem da galeria"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                </div>
                {image.caption && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {image.caption}
                  </p>
                )}
                <button
                  onClick={() => handleDelete(image.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Adicionar imagem"
      >
        <div className="space-y-4">
          <Input
            id="url"
            label="URL da imagem"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Input
            id="caption"
            label="Legenda (opcional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <Button onClick={handleAdd} disabled={isAdding || !url} className="w-full">
            {isAdding ? "Adicionando..." : "Adicionar"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
