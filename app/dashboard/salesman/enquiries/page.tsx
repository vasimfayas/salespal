import { getSalesPalSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSalesmanOrgIds } from "@/lib/scoping";
import { getEnquiriesPage } from "@/lib/enquiries";
import type { SearchParams } from "@/lib/list-params";
import { PageHeader } from "@/components/layout/PageHeader";
import { EnquiriesClient } from "@/components/enquiries/EnquiriesClient";

export default async function SalesmanEnquiriesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [params, session] = await Promise.all([searchParams, getSalesPalSession()]);
  const [data, companies] = await Promise.all([
    getEnquiriesPage({ ...session!.user, id: Number(session!.user.id) }, params),
    // Companies the salesman can raise enquiries under.
    getSalesmanOrgIds(Number(session!.user.id)).then((ids) =>
      prisma.organization.findMany({ where: { id: { in: ids } }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    ),
  ]);

  return (
    <>
      <PageHeader title="Enquiries" subtitle="Raise enquiries for your clients and track them through to orders." />
      <EnquiriesClient data={data} role="salesman" canCreate canFollowUp companies={companies} />
    </>
  );
}
