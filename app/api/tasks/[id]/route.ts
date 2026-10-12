import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { isRole, taskScopeWhere } from "@/lib/scoping";
import { LEAD_TASK_CATEGORY, REVISION_TASK_CATEGORY, isOpenTask, taskStatuses } from "@/types/task";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const scoped = await prisma.task.findFirst({ where: { AND: [{ id: Number(id) }, await taskScopeWhere(token)] } });
  if (!scoped) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const nextStatus: string = body.status ?? scoped.status;
  if (!taskStatuses.includes(nextStatus as never)) return NextResponse.json({ error: "Invalid task status" }, { status: 400 });
  // Lead and enquiry follow-ups close through their outcomes (which update the client / enquiry), not a bare status.
  const guided = scoped.category === LEAD_TASK_CATEGORY || scoped.enquiry_id !== null;
  if (guided && nextStatus !== scoped.status && !isOpenTask(nextStatus)) {
    return NextResponse.json(
      {
        error:
          scoped.category === REVISION_TASK_CATEGORY
            ? "This task completes when the offer is revised or re-confirmed"
            : scoped.enquiry_id
              ? "This task completes when the enquiry becomes an order (or is lost). Use Follow up to move its date."
              : "Record the outcome: contacted, follow-up or rejected",
      },
      { status: 409 },
    );
  }
  const closing = !isOpenTask(nextStatus) && isOpenTask(scoped.status);
  const reopening = isOpenTask(nextStatus) && !isOpenTask(scoped.status);
  const task = await prisma.$transaction(async (tx) => {
    const updated = await tx.task.update({
      where: { id: Number(id) },
      data: {
        status: nextStatus,
        due_date: body.due_date ? new Date(body.due_date) : scoped.due_date,
        description: body.description ?? scoped.description,
        ...(closing ? { closed_at: new Date() } : reopening ? { closed_at: null } : {}),
      },
    });
    if (nextStatus !== scoped.status) {
      await tx.taskUpdate.create({ data: { task_id: updated.id, action: "status", note: `Status: ${scoped.status} → ${nextStatus}`, created_by_id: Number(token.id) } });
    }
    return updated;
  });
  revalidateTag("salesman-dashboard", { expire: 0 });
  revalidateTag("salesman-tasks", { expire: 0 });
  revalidateTag("salesman-clients", { expire: 0 });
  revalidateTag("manager-dashboard", { expire: 0 });
  revalidateTag("manager-tasks", { expire: 0 });
  return NextResponse.json({ task });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isRole(token, [1, 2])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await context.params;
  const scoped = await prisma.task.findFirst({ where: { AND: [{ id: Number(id) }, await taskScopeWhere(token)] } });
  if (!scoped) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.task.delete({ where: { id: Number(id) } });
  revalidateTag("salesman-dashboard", { expire: 0 });
  revalidateTag("salesman-tasks", { expire: 0 });
  revalidateTag("salesman-clients", { expire: 0 });
  revalidateTag("manager-dashboard", { expire: 0 });
  revalidateTag("manager-tasks", { expire: 0 });
  return NextResponse.json({ ok: true });
}
