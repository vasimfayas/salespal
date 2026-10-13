import { getSalesPalSession } from "@/lib/auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { ApprovalsView } from "@/components/approvals/ApprovalsView";

/** Accounts: credit agreements for their companies waiting on the accounts step. */
export default async function ApprovalsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const [{ tab = "" }, session] = await Promise.all([searchParams, getSalesPalSession()]);
  return (
    <>
      <PageHeader title="Approvals" subtitle="Credit agreements waiting for the accounts check." />
      <ApprovalsView user={{ id: session!.user.id, role_id: session!.user.role_id }} role="accountant" tab={tab} basePath="/dashboard/accountant/approvals" />
    </>
  );
}
