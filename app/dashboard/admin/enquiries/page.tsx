import { getSalesPalSession } from "@/lib/auth";
import { getEnquiriesPage } from "@/lib/enquiries";
import { getCachedAdminOrgs } from "@/lib/cached-queries";
import type { SearchParams } from "@/lib/list-params";
import { PageHeader } from "@/components/layout/PageHeader";
import { EnquiriesClient } from "@/components/enquiries/EnquiriesClient";

export default async function AdminEnquiriesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [params, session] = await Promise.all([searchParams, getSalesPalSession()]);
  const [data, companies] = await Promise.all([getEnquiriesPage({ ...session!.user, id: Number(session!.user.id) }, params), getCachedAdminOrgs()]);

  return (
    <>
      <PageHeader title="Enquiries" subtitle="All enquiries across the company. Raise your own for any company." />
      {/* Owner and super admin: raise enquiries, every stage move, follow-ups and edits. */}
      <EnquiriesClient data={data} role="admin" canCreate canFollowUp companies={companies.map((c) => ({ id: c.id, name: c.name }))} />
    </>
  );
}
