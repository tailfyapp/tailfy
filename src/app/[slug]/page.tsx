import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileHeader } from "@/components/storefront/profile-header";
import { ContactInfo } from "@/components/storefront/contact-info";
import { ServiceList } from "@/components/storefront/service-list";
import { Gallery } from "@/components/storefront/gallery";
import { OpeningHours } from "@/components/storefront/opening-hours";
import { CtaButton, CtaButtonDesktop } from "@/components/storefront/cta-button";
import type { OpeningHours as OpeningHoursType } from "@/types";
import Link from "next/link";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProfile(slug: string) {
  const profile = await prisma.profile.findUnique({
    where: { slug, isActive: true },
    include: {
      services: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
      gallery: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return profile;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);

  if (!profile) {
    return { title: "Perfil não encontrado" };
  }

  const description =
    profile.bio ??
    `${profile.businessName} - Serviços pet profissionais${profile.city ? ` em ${profile.city}` : ""}`;

  return {
    title: profile.businessName,
    description,
    openGraph: {
      title: `${profile.businessName} | Tailfy`,
      description,
      type: "website",
      ...(profile.coverUrl && {
        images: [{ url: profile.coverUrl, width: 1200, height: 630 }],
      }),
    },
  };
}

export async function generateStaticParams() {
  try {
    const profiles = await prisma.profile.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    return profiles.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function StorefrontPage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await getProfile(slug);

  if (!profile) {
    notFound();
  }

  const openingHours = profile.openingHours as OpeningHoursType | null;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 sm:pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header com cover + avatar + info */}
        <ProfileHeader profile={profile} />

        {/* Conteúdo */}
        <div className="px-4 sm:px-6 mt-6 space-y-6">
          {/* CTA Desktop */}
          <CtaButtonDesktop
            whatsapp={profile.whatsapp}
            businessName={profile.businessName}
            slug={slug}
          />

          {/* Serviços */}
          <ServiceList services={profile.services} />

          {/* Galeria */}
          <Gallery images={profile.gallery} />

          {/* Horários */}
          <OpeningHours openingHours={openingHours} />

          {/* Contato */}
          <ContactInfo profile={profile} />

          {/* Footer */}
          <footer className="text-center py-6 text-sm text-gray-400">
            Feito com{" "}
            <Link
              href="/"
              className="text-purple-500 hover:text-purple-600 font-medium"
            >
              Tailfy
            </Link>
          </footer>
        </div>
      </div>

      {/* CTA Mobile fixo */}
      <CtaButton
        whatsapp={profile.whatsapp}
        businessName={profile.businessName}
        slug={slug}
      />
    </div>
  );
}
