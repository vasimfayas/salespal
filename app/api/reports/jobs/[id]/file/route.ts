import { NextResponse } from "next/server";
import { getSalesPalSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readDocumentFile } from "@/lib/company-documents";

export const runtime = "nodejs";

/** Download a finished report. Only the person who requested it can fetch it. */
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSalesPalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const job = await prisma.reportJob.findFirst({ where: { id: Number(id), requested_by: Number(session.user.id), status: "done" } });
  if (!job?.file_path) return NextResponse.json({ error: "Report not found" }, { status: 404 });
  const pdf = await readDocumentFile(job.file_path).catch(() => null);
  if (!pdf) return NextResponse.json({ error: "Report file is no longer available" }, { status: 410 });
  const download = new URL(request.url).searchParams.get("download");
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.length),
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(job.file_name ?? "report.pdf")}`,
      "Cache-Control": "private, no-store",
    },
  });
}
