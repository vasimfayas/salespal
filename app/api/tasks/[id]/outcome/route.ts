import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { getTokenUserId, taskScopeWhere } from "@/lib/scoping";
import { applyLeadOutcome, OutcomeError } from "@/lib/task-outcomes";
import { revalidateTaskViews } from "@/lib/enquiry-follow-ups";
import { revalidateClientViews } from "@/lib/client-status-flow";
import { leadOutcomes, type LeadOutcome } from "@/types/task";

/** Record a lead follow-up outcome (contacted / follow_up / rejected). See lib/task-outcomes.ts. */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  // Assignee, their manager or the owner (same scope as other task edits).
  const scoped = await prisma.task.findFirst({ where: { AND: [{ id: Number(id) }, await taskScopeWhere(token)] }, select: { id: true } });
  if (!scoped) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  if (!leadOutcomes.includes(body.outcome)) return NextResponse.json({ error: "Choose contacted, follow-up or rejected" }, { status: 400 });

  try {
    const result = await applyLeadOutcome(scoped.id, { ...body, outcome: body.outcome as LeadOutcome }, getTokenUserId(token));
    revalidateTaskViews();
    revalidateClientViews();
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof OutcomeError) return NextResponse.json({ error: error.message, ...error.extra }, { status: error.status });
    throw error;
  }
}
