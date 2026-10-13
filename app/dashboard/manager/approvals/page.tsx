import { getSalesPalSession } from "@/lib/auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { ApprovalsView } from "@/components/approvals/ApprovalsView";

/** Managers: credit agreements and enquiry quotes of their team's clients. */
export default async function ApprovalsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const [{ tab = "" }, session] = await Promise.all([searchParams, getSalesPalSession()]);
  return (
    <>
      <PageHeader title="Approvals" subtitle="Credit agreements and enquiry quotes from your team waiting for you." />
      <ApprovalsView user={{ id: session!.user.id, role_id: session!.user.role_id }} role="manager" tab={tab} basePath="/dashboard/manager/approvals" clientHref={(id) => `/dashboard/manager/clients/${id}`} />
    </>
  );
}
