import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSalesPalSession } from "@/lib/auth";
import { getManagerOrgIds } from "@/lib/scoping";
import { PageHeader } from "@/components/layout/PageHeader";
import { CompanyReportForm } from "@/components/reports/CompanyReportForm";

/** Company report for the manager's companies. */
export default async function ManagerReportsPage() {
  const session = await getSalesPalSession();
  if (!session) redirect("/login");
  const companies = await prisma.organization.findMany({
    where: { id: { in: await getManagerOrgIds(session.user.id) } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return (
    <>
      <PageHeader title="Reports" subtitle="Company performance for any date range." />
      <CompanyReportForm companies={companies} />
    </>
  );
}
