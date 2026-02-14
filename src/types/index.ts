import type { Profile, Service, GalleryImage } from "@/generated/prisma/client";

export type ProfileWithRelations = Profile & {
  services: Service[];
  gallery: GalleryImage[];
};

export type OpeningHoursSchedule = {
  open: string;
  close: string;
} | null;

export type OpeningHours = Record<string, OpeningHoursSchedule>;
