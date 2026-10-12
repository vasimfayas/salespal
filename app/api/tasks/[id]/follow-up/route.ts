import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { getTokenUserId, taskScopeWhere } from "@/lib/scoping";
import { parseDateOnly } from "@/lib/salesman-targets";
import { revalidateTaskViews } from "@/lib/enquiry-follow-ups";
import { isOpenTask } from "@/types/task";

/** Task types followed up here; enquiry follow-ups go through POST /api/enquiries/<id>/follow-ups. */
const FOLLOW_UP_CATEGORIES = ["order_follow_up", "client_follow_up"];

/** Follow up an order / client follow-up task (body: comment, due_date YYYY-MM-DD): logs the comment and moves the due date. */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const task = await prisma.task.findFirst({ where: { AND: [{ id: Number((await context.params).id) }, await taskScopeWhere(token)] } });
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  if (!FOLLOW_UP_CATEGORIES.includes(task.category ?? "") || task.enquiry_id) return NextResponse.json({ error: "This task can't be followed up here" }, { status: 409 });
  if (!isOpenTask(task.status)) return NextResponse.json({ error: "This task is already closed" }, { status: 409 });

  const body = await request.json().catch(() => ({}));
  const comment = String(body.comment ?? "").trim();
  if (!comment) return NextResponse.json({ error: "Write a follow-up comment" }, { status: 400 });
  if (comment.length > 2000) return NextResponse.json({ error: "Comment is too long (max 2000 characters)" }, { status: 400 });
  const dueDate = parseDateOnly(body.due_date);
  if (!dueDate || dueDate < new Date(new Date().toISOString().slice(0, 10))) {
    return NextResponse.json({ error: "Pick a next follow-up date from today onwards" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.task.update({ where: { id: task.id }, data: { due_date: dueDate } }),
    prisma.taskUpdate.create({
      data: { task_id: task.id, action: "follow_up", note: comment, prev_due_date: task.due_date, new_due_date: dueDate, created_by_id: getTokenUserId(token) },
    }),
  ]);
  revalidateTaskViews();
  return NextResponse.json({ ok: true });
}
