import { requireAuth, getUserProfile } from "@/lib/auth-helpers";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ToastProvider } from "@/components/ui/toast";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const profile = await getUserProfile();

  return (
    <>
      <ToastProvider />
      <DashboardShell businessName={profile.businessName} slug={profile.slug}>
        {children}
      </DashboardShell>
    </>
  );
}
