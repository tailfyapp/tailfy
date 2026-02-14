import { getUserProfile } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { GalleryUploader } from "@/components/dashboard/gallery-uploader";

export default async function GaleriaPage() {
  const profile = await getUserProfile();

  const images = await prisma.galleryImage.findMany({
    where: { profileId: profile.id },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Galeria</h1>
        <p className="text-gray-500 mt-1">
          Gerencie as fotos do seu portfólio.
        </p>
      </div>

      <GalleryUploader images={images} />
    </div>
  );
}
