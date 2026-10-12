import path from "node:path";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getSalesPalSession } from "@/lib/auth";
import { getManagerOrgIds } from "@/lib/scoping";
import { readDocumentFile } from "@/lib/company-documents";
import { getCompanyReport, parseRange } from "@/lib/company-report";
import { CompanyReportPdf, type PdfLogo } from "@/components/reports/CompanyReportPdf";

export const runtime = "nodejs";

/** Company report PDF: GET ?org=<id>&from=YYYY-MM-DD&to=YYYY-MM-DD[&download=1]. Owner (any company) and managers (their companies). */
export async function GET(request: Request) {
  const session = await getSalesPalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, role_id } = session.user;
  if (role_id !== 1 && role_id !== 2) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const params = new URL(request.url).searchParams;
  const orgId = Number(params.get("org"));
  const range = parseRange(params.get("from"), params.get("to"));
  if (!Number.isInteger(orgId) || orgId <= 0) return NextResponse.json({ error: "Pick a company" }, { status: 400 });
  if (!range) return NextResponse.json({ error: "Pick a valid date range (from must be on or before to)" }, { status: 400 });
  if (role_id === 2 && !(await getManagerOrgIds(id)).includes(orgId)) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const report = await getCompanyReport(orgId, range, { id, role_id });
  if (!report) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  let logo: PdfLogo = null;
  if (report.org.logo_path) {
    const ext = path.extname(report.org.logo_path).slice(1).toLowerCase();
    // A missing logo file shouldn't stop the report; the company name is shown instead.
    logo = await readDocumentFile(report.org.logo_path)
      .then((data) => ({ data, format: ext === "png" ? ("png" as const) : ("jpg" as const) }))
      .catch(() => null);
  }

  const pdf = await renderToBuffer(<CompanyReportPdf report={report} logo={logo} />);
  const fileName = `${report.org.name} report ${params.get("from")} to ${params.get("to")}.pdf`.replace(/[\\/:*?"<>|]+/g, "-");
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.length),
      "Content-Disposition": `${params.get("download") ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
