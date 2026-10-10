import { getSalesPalSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getManagerOrgIds } from "@/lib/scoping";
import { getEnquiriesPage } from "@/lib/enquiries";
import type { SearchParams } from "@/lib/list-params";
import { PageHeader } from "@/components/layout/PageHeader";
import { EnquiriesClient } from "@/components/enquiries/EnquiriesClient";

export default async function ManagerEnquiriesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [params, session] = await Promise.all([searchParams, getSalesPalSession()]);
  const [data, companies] = await Promise.all([
    getEnquiriesPage({ ...session!.user, id: Number(session!.user.id) }, params),
    // Companies the manager can raise enquiries under.
    getManagerOrgIds(Number(session!.user.id)).then((ids) =>
      prisma.organization.findMany({ where: { id: { in: ids } }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    ),
  ]);

  return (
    <>
      <PageHeader title="Enquiries" subtitle="Enquiries from you and your team, from quote to order." />
      <EnquiriesClient data={data} role="manager" canCreate canFollowUp companies={companies} />
    </>
  );
}
