import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { getReportStaff } from "@/lib/company-report";
import { CompanyReportForm } from "@/components/reports/CompanyReportForm";

/** Company performance report for any date range. */
export default async function ReportsPage() {
  const companies = await prisma.organization.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  const staff = await getReportStaff({ id: 0, role_id: 1 }, companies.map((c) => c.id));
  return (
    <>
      <PageHeader title="Reports" subtitle="Company performance for any date range." />
      <CompanyReportForm companies={companies} staff={staff} />
    </>
  );
}
