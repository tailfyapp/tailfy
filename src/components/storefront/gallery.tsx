import Image from "next/image";
import type { GalleryImage } from "@/generated/prisma/client";

interface GalleryProps {
  images: GalleryImage[];
}

export function Gallery({ images }: GalleryProps) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  if (sorted.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Portfólio</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {sorted.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
          >
            <Image
              src={image.url}
              alt={image.caption ?? "Foto do portfólio"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            {image.caption && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <p className="text-white text-sm font-medium">
                  {image.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
