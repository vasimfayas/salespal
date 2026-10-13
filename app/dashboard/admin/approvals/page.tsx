import { getSalesPalSession } from "@/lib/auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { ApprovalsView } from "@/components/approvals/ApprovalsView";

/** Owner: the final step of credit agreements. Super admin: every pending request. */
export default async function ApprovalsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const [{ tab = "" }, session] = await Promise.all([searchParams, getSalesPalSession()]);
  return (
    <>
      <PageHeader title="Approvals" subtitle="Requests waiting for your approval, and the decision log." />
      <ApprovalsView user={{ id: session!.user.id, role_id: session!.user.role_id }} role="admin" tab={tab} basePath="/dashboard/admin/approvals" />
    </>
  );
}
