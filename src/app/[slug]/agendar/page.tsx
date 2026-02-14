import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/storefront/booking-form";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AgendarPage({ params }: PageProps) {
  const { slug } = await params;

  const profile = await prisma.profile.findUnique({
    where: { slug, isActive: true },
    include: {
      services: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!profile) notFound();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-6">
          <Link
            href={`/${slug}`}
            className="text-sm text-purple-600 hover:underline"
          >
            &larr; Voltar para {profile.businessName}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            Agendar horário
          </h1>
          <p className="text-gray-500 mt-1">
            {profile.businessName}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <BookingForm
            slug={slug}
            profileId={profile.id}
            services={profile.services}
          />
        </div>
      </div>
    </div>
  );
}
