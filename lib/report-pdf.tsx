import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { getManagerOrgIds } from "@/lib/scoping";
import { readDocumentFile } from "@/lib/company-documents";
import { getCompanyReport, parseRange } from "@/lib/company-report";
import { CompanyReportPdf, type PdfLogo } from "@/components/reports/CompanyReportPdf";
import { isOwnerRole } from "@/lib/roles";

export type ReportActor = { id: number; role_id: number };

/** Owner (any company) and managers (their companies) may report on a company. */
export async function canReportOn(actor: ReportActor, orgId: number) {
  if (isOwnerRole(actor.role_id)) return true;
  return actor.role_id === 2 && (await getManagerOrgIds(actor.id)).includes(orgId);
}

/** The company report PDF for a date range, or null when the company doesn't exist. Shared by the web route and the worker. */
export async function buildCompanyReportPdf(orgId: number, from: string, to: string, actor: ReportActor) {
  const range = parseRange(from, to);
  if (!range) throw new Error("Invalid date range");
  const report = await getCompanyReport(orgId, range, actor);
  if (!report) return null;

  let logo: PdfLogo = null;
  if (report.org.logo_path) {
    const ext = path.extname(report.org.logo_path).slice(1).toLowerCase();
    // A missing logo file shouldn't stop the report; the company name is shown instead.
    logo = await readDocumentFile(report.org.logo_path)
      .then((data) => ({ data, format: ext === "png" ? ("png" as const) : ("jpg" as const) }))
      .catch(() => null);
  }
  const pdf = await renderToBuffer(<CompanyReportPdf report={report} logo={logo} />);
  const fileName = `${report.org.name} report ${from} to ${to}.pdf`.replace(/[\\/:*?"<>|]+/g, "-");
  return { pdf, fileName };
}
