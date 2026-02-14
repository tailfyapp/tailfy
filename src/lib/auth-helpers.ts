import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function getUserProfile() {
  const user = await requireAuth();
  if (!user.profileId) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { id: user.profileId },
  });

  if (!profile) redirect("/login");
  return profile;
}
