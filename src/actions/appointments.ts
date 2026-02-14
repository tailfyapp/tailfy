"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { getAvailableSlots } from "@/lib/availability";
import { appointmentSchema, publicBookingSchema } from "@/lib/validators";
import { addMinutes, parse, startOfDay } from "date-fns";
import type { AppointmentStatus } from "@/generated/prisma/client";

export type AppointmentState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function createAppointmentAction(
  _prev: AppointmentState,
  formData: FormData
): Promise<AppointmentState> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const raw = {
    clientId: formData.get("clientId") as string,
    serviceId: formData.get("serviceId") as string,
    startTime: formData.get("startTime") as string,
    price: formData.get("price") ? Number(formData.get("price")) : undefined,
    notes: (formData.get("notes") as string) || undefined,
  };

  const result = appointmentSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { fieldErrors };
  }

  // Verify ownership
  const [client, service] = await Promise.all([
    prisma.client.findUnique({
      where: { id: result.data.clientId },
      select: { profileId: true },
    }),
    prisma.service.findUnique({
      where: { id: result.data.serviceId },
      select: { profileId: true, duration: true },
    }),
  ]);

  if (!client || client.profileId !== user.profileId) {
    return { error: "Cliente não encontrado." };
  }
  if (!service || service.profileId !== user.profileId) {
    return { error: "Serviço não encontrado." };
  }

  const startTime = new Date(result.data.startTime);
  const duration = service.duration ?? 60;
  const endTime = addMinutes(startTime, duration);

  await prisma.appointment.create({
    data: {
      profileId: user.profileId,
      clientId: result.data.clientId,
      serviceId: result.data.serviceId,
      startTime,
      endTime,
      price: result.data.price,
      notes: result.data.notes,
      status: "CONFIRMED",
    },
  });

  revalidatePath("/dashboard/agendamentos");
  return { success: true };
}

export async function updateAppointmentStatusAction(
  appointmentId: string,
  status: AppointmentStatus
): Promise<{ error?: string }> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: { profileId: true },
  });

  if (!appointment || appointment.profileId !== user.profileId) {
    return { error: "Agendamento não encontrado." };
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });

  revalidatePath("/dashboard/agendamentos");
  return {};
}

export async function deleteAppointmentAction(
  appointmentId: string
): Promise<{ error?: string }> {
  const user = await requireAuth();
  if (!user.profileId) return { error: "Perfil não encontrado." };

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: { profileId: true },
  });

  if (!appointment || appointment.profileId !== user.profileId) {
    return { error: "Agendamento não encontrado." };
  }

  await prisma.appointment.delete({ where: { id: appointmentId } });
  revalidatePath("/dashboard/agendamentos");
  return {};
}

export async function getAvailableSlotsAction(
  profileId: string,
  dateStr: string,
  serviceId: string
): Promise<string[]> {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { duration: true },
  });

  const duration = service?.duration ?? 60;
  const date = new Date(dateStr);

  return getAvailableSlots(profileId, date, duration);
}

export type PublicBookingState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function createPublicBookingAction(
  slug: string,
  _prev: PublicBookingState,
  formData: FormData
): Promise<PublicBookingState> {
  const raw = {
    serviceId: formData.get("serviceId") as string,
    date: formData.get("date") as string,
    time: formData.get("time") as string,
    clientName: formData.get("clientName") as string,
    clientPhone: formData.get("clientPhone") as string,
    clientEmail: (formData.get("clientEmail") as string) || undefined,
    petName: (formData.get("petName") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  };

  const result = publicBookingSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { fieldErrors };
  }

  const profile = await prisma.profile.findUnique({
    where: { slug, isActive: true },
    select: { id: true },
  });

  if (!profile) return { error: "Estabelecimento não encontrado." };

  const service = await prisma.service.findUnique({
    where: { id: result.data.serviceId },
    select: { profileId: true, duration: true, priceMin: true },
  });

  if (!service || service.profileId !== profile.id) {
    return { error: "Serviço não encontrado." };
  }

  // Parse date and time
  const dateObj = new Date(result.data.date);
  const dayStart = startOfDay(dateObj);
  const startTime = parse(result.data.time, "HH:mm", dayStart);
  const duration = service.duration ?? 60;
  const endTime = addMinutes(startTime, duration);

  // Find or create client
  let client = await prisma.client.findFirst({
    where: {
      profileId: profile.id,
      phone: result.data.clientPhone,
    },
  });

  if (!client) {
    client = await prisma.client.create({
      data: {
        profileId: profile.id,
        name: result.data.clientName,
        phone: result.data.clientPhone,
        email: result.data.clientEmail || null,
      },
    });
  }

  // Create pet if provided
  if (result.data.petName) {
    const existingPet = await prisma.pet.findFirst({
      where: { clientId: client.id, name: result.data.petName },
    });
    if (!existingPet) {
      await prisma.pet.create({
        data: { clientId: client.id, name: result.data.petName },
      });
    }
  }

  await prisma.appointment.create({
    data: {
      profileId: profile.id,
      clientId: client.id,
      serviceId: result.data.serviceId,
      startTime,
      endTime,
      price: service.priceMin,
      notes: result.data.notes,
      status: "PENDING",
    },
  });

  return { success: true };
}
