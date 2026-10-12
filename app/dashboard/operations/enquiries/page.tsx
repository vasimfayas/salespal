import { getSalesPalSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEnquiriesPage } from "@/lib/enquiries";
import type { SearchParams } from "@/lib/list-params";
import { PageHeader } from "@/components/layout/PageHeader";
import { EnquiriesClient } from "@/components/enquiries/EnquiriesClient";
import { AccountantCompanyChips, NoAssignedCompanies } from "@/components/accountant/AccountantCompanies";

/** Operations: the enquiries of their companies, which they price (quote / requote). */
export default async function OperationsEnquiriesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [params, session] = await Promise.all([searchParams, getSalesPalSession()]);
  const user = { ...session!.user, id: Number(session!.user.id) };
  const [data, links] = await Promise.all([
    getEnquiriesPage(user, params),
    prisma.operationsOrg.findMany({ where: { user_id: user.id }, select: { org: { select: { id: true, name: true } } }, orderBy: { org: { name: "asc" } } }),
  ]);
  const companies = links.map((l) => l.org);

  return (
    <>
      <PageHeader title="Enquiries" subtitle="Price enquiries for your companies: quote new ones and requote when sales asks." action={<AccountantCompanyChips companies={companies} />} />
      {companies.length === 0 ? (
        <NoAssignedCompanies message="Their enquiries appear here once you are assigned." />
      ) : (
        <EnquiriesClient data={data} role="operations" canCreate={false} stageOnly={["quote", "requote"]} />
      )}
    </>
  );
}
