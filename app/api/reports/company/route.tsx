import { NextResponse } from "next/server";
import { getSalesPalSession } from "@/lib/auth";
import { parseRange } from "@/lib/company-report";
import { buildCompanyReportPdf, canReportOn } from "@/lib/report-pdf";
import { isOwnerRole } from "@/lib/roles";

export const runtime = "nodejs";

/** Company report PDF: GET ?org=<id>&from=YYYY-MM-DD&to=YYYY-MM-DD[&download=1]. Owner (any company) and managers (their companies). */
export async function GET(request: Request) {
  const session = await getSalesPalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, role_id } = session.user;
  if (!isOwnerRole(role_id) && role_id !== 2) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const params = new URL(request.url).searchParams;
  const orgId = Number(params.get("org"));
  const range = parseRange(params.get("from"), params.get("to"));
  if (!Number.isInteger(orgId) || orgId <= 0) return NextResponse.json({ error: "Pick a company" }, { status: 400 });
  if (!range) return NextResponse.json({ error: "Pick a valid date range (from must be on or before to)" }, { status: 400 });

  if (!(await canReportOn({ id, role_id }, orgId))) return NextResponse.json({ error: "Company not found" }, { status: 404 });
  const built = await buildCompanyReportPdf(orgId, params.get("from")!, params.get("to")!, { id, role_id });
  if (!built) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const { pdf, fileName } = built;
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.length),
      "Content-Disposition": `${params.get("download") ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
