import { redirect } from "next/navigation";
import { getSalesPalSession } from "@/lib/auth";
import { NavigationProvider } from "@/components/layout/NavigationContext";
import { AppShell } from "@/components/layout/AppShell";
import { CoverBanner } from "@/components/layout/CoverBanner";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSalesPalSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <NavigationProvider>
      <AppShell>
        <CoverBanner userId={Number(session.user.id)} />
        {children}
      </AppShell>
    </NavigationProvider>
  );
}
