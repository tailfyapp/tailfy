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

export const loginSchema = z.object({
  email: z.email("Email inválido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

export const signupSchema = z
  .object({
    businessName: z.string().min(2, "Nome do negócio deve ter pelo menos 2 caracteres.").max(100),
    email: z.email("Email inválido."),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const clientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres.").max(100),
  phone: z.string().max(20).optional(),
  email: z.email("Email inválido.").optional().or(z.literal("")),
  notes: z.string().max(500).optional(),
});

export const petSchema = z.object({
  name: z.string().min(1, "Nome do pet é obrigatório.").max(100),
  breed: z.string().max(100).optional(),
  size: z.enum(["SMALL", "MEDIUM", "LARGE", "EXTRA_LARGE"]).optional(),
  notes: z.string().max(500).optional(),
});

export const appointmentSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente."),
  serviceId: z.string().min(1, "Selecione um serviço."),
  startTime: z.string().min(1, "Selecione data e horário."),
  price: z.number().min(0).optional(),
  notes: z.string().max(500).optional(),
});

export const publicBookingSchema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço."),
  date: z.string().min(1, "Selecione uma data."),
  time: z.string().min(1, "Selecione um horário."),
  clientName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres.").max(100),
  clientPhone: z.string().min(8, "Telefone inválido.").max(20),
  clientEmail: z.email("Email inválido.").optional().or(z.literal("")),
  petName: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});
