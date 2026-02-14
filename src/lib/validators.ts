import { z } from "zod/v4";

export const slugSchema = z.string().min(3).max(60).regex(/^[a-z0-9-]+$/);

export const profileSchema = z.object({
  slug: slugSchema,
  businessName: z.string().min(2).max(100),
  ownerName: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().max(20).optional(),
  whatsapp: z.string().max(20).optional(),
  instagram: z.string().max(50).optional(),
  address: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(2).optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  duration: z.number().int().min(5).max(480).optional(),
});
