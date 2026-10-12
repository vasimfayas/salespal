import { redirect } from "next/navigation";
import { getSalesPalSession } from "@/lib/auth";
import { MantineChartsProvider } from "@/components/dashboard/MantineChartsProvider";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import { isOwnerRole } from "@/lib/roles";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSalesPalSession();
  if (!session) redirect("/login");
  if (!isOwnerRole(session.user.role_id)) redirect("/dashboard");
  return <MantineChartsProvider>{children}</MantineChartsProvider>;
}
