export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(
  min?: { toString(): string } | null,
  max?: { toString(): string } | null
): string {
  if (!min && !max) return "Consulte";

  const fmt = (v: { toString(): string }) =>
    Number(v.toString()).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  if (min && max && Number(min.toString()) !== Number(max.toString())) {
    return `${fmt(min)} - ${fmt(max)}`;
  }

  return fmt(min ?? max!);
}

export function formatDuration(minutes?: number | null): string {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m}min` : `${h}h`;
}

export function formatWhatsAppUrl(
  whatsapp: string,
  businessName?: string
): string {
  const message = encodeURIComponent(
    `Olá${businessName ? `, ${businessName}` : ""}! Gostaria de agendar um horário.`
  );
  return `https://wa.me/${whatsapp}?text=${message}`;
}

export function formatInstagramUrl(instagram: string): string {
  return `https://instagram.com/${instagram.replace("@", "")}`;
}

const DAY_LABELS: Record<string, string> = {
  mon: "Segunda",
  tue: "Terça",
  wed: "Quarta",
  thu: "Quinta",
  fri: "Sexta",
  sat: "Sábado",
  sun: "Domingo",
};

const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

type DaySchedule = { open: string; close: string } | null;
type OpeningHours = Record<string, DaySchedule>;

export function getDayLabel(day: string): string {
  return DAY_LABELS[day] ?? day;
}

export function getOrderedDays(): string[] {
  return DAY_ORDER;
}

export function isOpenNow(openingHours?: OpeningHours | null): boolean {
  if (!openingHours) return false;

  const now = new Date();
  const dayIndex = now.getDay();
  const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const today = dayKeys[dayIndex];
  const schedule = openingHours[today];

  if (!schedule) return false;

  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return currentTime >= schedule.open && currentTime <= schedule.close;
}
