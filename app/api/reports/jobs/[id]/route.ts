import { NextResponse } from "next/server";
import { getSalesPalSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removeDocumentFile } from "@/lib/company-documents";

export const runtime = "nodejs";

/** Delete one of your finished or failed reports (the PDF and its row). A report still being built can't be deleted. */
export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSalesPalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const job = await prisma.reportJob.findFirst({ where: { id: Number(id), requested_by: Number(session.user.id) }, select: { id: true, status: true, file_path: true } });
  if (!job) return NextResponse.json({ error: "Report not found" }, { status: 404 });
  if (job.status === "queued" || job.status === "running") return NextResponse.json({ error: "This report is still being prepared" }, { status: 409 });
  if (job.file_path) await removeDocumentFile(job.file_path).catch(() => {});
  await prisma.reportJob.delete({ where: { id: job.id } });
  return NextResponse.json({ ok: true });
}
