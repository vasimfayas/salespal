import { getSalesPalSession } from "@/lib/auth";
import { getEnquiriesPage } from "@/lib/enquiries";
import type { SearchParams } from "@/lib/list-params";
import { PageHeader } from "@/components/layout/PageHeader";
import { EnquiriesClient } from "@/components/enquiries/EnquiriesClient";
import { SUPER_ADMIN_ROLE } from "@/lib/roles";

export default async function AdminEnquiriesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [params, session] = await Promise.all([searchParams, getSalesPalSession()]);
  const data = await getEnquiriesPage({ ...session!.user, id: Number(session!.user.id) }, params);

  return (
    <>
      <PageHeader title="Enquiries" subtitle="All enquiries across the company." />
      {/* Super admin: every stage move, follow-ups and edits; the owner views. */}
      <EnquiriesClient data={data} role="admin" canCreate={false} canFollowUp={session!.user.role_id === SUPER_ADMIN_ROLE} />
    </>
  );
}
