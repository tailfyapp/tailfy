import { addMinutes, format, parse, isBefore, isEqual, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import type { OpeningHours } from "@/types";

const SLOT_INTERVAL = 30; // minutes
const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export async function getAvailableSlots(
  profileId: string,
  date: Date,
  serviceDuration: number
): Promise<string[]> {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { openingHours: true },
  });

  if (!profile?.openingHours) return [];

  const openingHours = profile.openingHours as OpeningHours;
  const dayKey = DAY_KEYS[date.getDay()];
  const schedule = openingHours[dayKey];

  if (!schedule) return []; // Closed

  const dayStart = startOfDay(date);
  const openTime = parse(schedule.open, "HH:mm", dayStart);
  const closeTime = parse(schedule.close, "HH:mm", dayStart);

  // Generate all possible slots
  const slots: string[] = [];
  let current = openTime;

  while (true) {
    const endTime = addMinutes(current, serviceDuration);
    if (isBefore(closeTime, endTime) && !isEqual(closeTime, endTime)) break;
    slots.push(format(current, "HH:mm"));
    current = addMinutes(current, SLOT_INTERVAL);
  }

  // Get existing appointments for this day
  const dayEnd = addMinutes(startOfDay(date), 24 * 60);
  const appointments = await prisma.appointment.findMany({
    where: {
      profileId,
      startTime: { gte: dayStart, lt: dayEnd },
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
    },
    select: { startTime: true, endTime: true },
  });

  // Filter out conflicting slots
  return slots.filter((slot) => {
    const slotStart = parse(slot, "HH:mm", dayStart);
    const slotEnd = addMinutes(slotStart, serviceDuration);

    return !appointments.some((apt) => {
      const aptStart = new Date(apt.startTime);
      const aptEnd = new Date(apt.endTime);
      // Overlap: slotStart < aptEnd AND slotEnd > aptStart
      return isBefore(slotStart, aptEnd) && isBefore(aptStart, slotEnd);
    });
  });
}
