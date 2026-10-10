import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { taskScopeWhere } from "@/lib/scoping";

/** A task's history: outcomes, reasons, due-date changes, newest first. */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const task = await prisma.task.findFirst({
    where: { AND: [{ id: Number(id) }, await taskScopeWhere(token)] },
    select: { updates: { include: { createdBy: { select: { name: true } } }, orderBy: { created_at: "desc" } } },
  });
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  return NextResponse.json({
    updates: task.updates.map((u) => ({
      id: u.id,
      action: u.action,
      note: u.note,
      prev_due_date: u.prev_due_date?.toISOString() ?? null,
      new_due_date: u.new_due_date?.toISOString() ?? null,
      by: u.createdBy.name,
      at: u.created_at.toISOString(),
    })),
  });
}
