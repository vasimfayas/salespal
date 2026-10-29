import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSalesPalSession } from "@/lib/auth";
import { getManagerOrgIds } from "@/lib/scoping";
import { PageHeader } from "@/components/layout/PageHeader";
import { getReportStaff } from "@/lib/company-report";
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
  const staff = await getReportStaff({ id: session.user.id, role_id: 2 }, companies.map((c) => c.id));
  return (
    <>
      <PageHeader title="Reports" subtitle="Company performance for any date range." />
      <CompanyReportForm companies={companies} staff={staff} />
    </>
  );
}
