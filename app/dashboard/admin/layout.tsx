import { redirect } from "next/navigation";
import { getSalesPalSession } from "@/lib/auth";
import { MantineChartsProvider } from "@/components/dashboard/MantineChartsProvider";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import { isOwnerRole } from "@/lib/roles";
import { EnquiryFollowUpSync } from "@/components/enquiries/EnquiryFollowUpSync";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSalesPalSession();
  if (!session) redirect("/login");
  if (!isOwnerRole(session.user.role_id)) redirect("/dashboard");
  return (
    <MantineChartsProvider>
      {/* Owners raise enquiries too: follow-up tasks for their stale ones. */}
      <EnquiryFollowUpSync />
      {children}
    </MantineChartsProvider>
  );
}
