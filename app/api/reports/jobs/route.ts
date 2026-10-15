import { NextResponse } from "next/server";
import { getSalesPalSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseRange } from "@/lib/company-report";
import { canReportOn } from "@/lib/report-pdf";
import { reportQueue } from "@/lib/report-queue";
import { isOwnerRole } from "@/lib/roles";

export const runtime = "nodejs";

const select = { id: true, status: true, params: true, file_name: true, error: true, created_at: true, finished_at: true } as const;

/** The signed-in user's latest report jobs. */
export async function GET() {
  const session = await getSalesPalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const jobs = await prisma.reportJob.findMany({ where: { requested_by: Number(session.user.id) }, orderBy: { id: "desc" }, take: 10, select });
  // The PDF library reports no progress, so the page estimates from how long recent reports took (request to finish).
  const recent = await prisma.reportJob.findMany({ where: { status: "done", finished_at: { not: null } }, orderBy: { id: "desc" }, take: 10, select: { created_at: true, finished_at: true } });
  const secs = recent.map((r) => (r.finished_at!.getTime() - r.created_at.getTime()) / 1000);
  const typical_seconds = secs.length ? Math.max(3, Math.round(secs.reduce((a, b) => a + b, 0) / secs.length)) : 10;
  const withQueue = await Promise.all(
    jobs.map(async (job) => ({
      ...job,
      ahead: job.status === "queued" ? await prisma.reportJob.count({ where: { status: { in: ["queued", "running"] }, id: { lt: job.id } } }) : 0,
    })),
  );
  return NextResponse.json({ jobs: withQueue, typical_seconds });
}

/** Queue a company report: { org, from, to }. The worker builds it; poll GET for the status. */
export async function POST(request: Request) {
  const session = await getSalesPalSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const actor = { id: Number(session.user.id), role_id: session.user.role_id };
  if (!isOwnerRole(actor.role_id) && actor.role_id !== 2) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const org = Number(body.org);
  if (!Number.isInteger(org) || org <= 0) return NextResponse.json({ error: "Pick a company" }, { status: 400 });
  if (!parseRange(body.from, body.to)) return NextResponse.json({ error: "Pick a valid date range (from must be on or before to)" }, { status: 400 });
  if (!(await canReportOn(actor, org))) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const job = await prisma.reportJob.create({ data: { type: "company", params: { org, from: body.from, to: body.to }, requested_by: actor.id }, select });
  await reportQueue().add("company", { reportJobId: job.id });
  return NextResponse.json({ job }, { status: 202 });
}
