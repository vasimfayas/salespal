import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { clientScopeWhere } from "@/lib/scoping";
import { clientTasksWhere } from "@/lib/client-tasks";
import { isOpenTask } from "@/types/task";


export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; taskId: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, taskId } = await context.params;
  const clientId = Number(id);
  const clientTaskId = Number(taskId);

  const client = await prisma.client.findFirst({
    where: { AND: [{ id: clientId }, await clientScopeWhere(token)] },
  });
  if (!client) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const task = await prisma.task.findFirst({
    where: { id: clientTaskId, ...clientTasksWhere(clientId) },
  });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const body = await request.json();

  const nextStatus: string = body.status !== undefined ? body.status : task.status;
  const closing = !isOpenTask(nextStatus) && isOpenTask(task.status);
  const reopening = isOpenTask(nextStatus) && !isOpenTask(task.status);
  const updatedTask = await prisma.task.update({
    where: { id: clientTaskId },
    data: {
      status: nextStatus,
      ...(closing ? { closed_at: new Date() } : reopening ? { closed_at: null } : {}),
      description: body.description !== undefined ? body.description : task.description,
      due_date: body.due_date !== undefined ? new Date(body.due_date) : task.due_date,
    },
  });

  revalidateTag("salesman-dashboard", { expire: 0 });
  revalidateTag("salesman-clients", { expire: 0 });
  revalidateTag("salesman-tasks", { expire: 0 });
  revalidateTag("manager-dashboard", { expire: 0 });
  revalidateTag("manager-tasks", { expire: 0 });

  return NextResponse.json({ task: updatedTask });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; taskId: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, taskId } = await context.params;
  const clientId = Number(id);
  const clientTaskId = Number(taskId);

  const client = await prisma.client.findFirst({
    where: { AND: [{ id: clientId }, await clientScopeWhere(token)] },
  });
  if (!client) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const task = await prisma.task.findFirst({
    where: { id: clientTaskId, ...clientTasksWhere(clientId) },
  });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  await prisma.task.delete({
    where: { id: clientTaskId },
  });

  revalidateTag("salesman-dashboard", { expire: 0 });
  revalidateTag("salesman-clients", { expire: 0 });
  revalidateTag("salesman-tasks", { expire: 0 });
  revalidateTag("manager-dashboard", { expire: 0 });
  revalidateTag("manager-tasks", { expire: 0 });

  return NextResponse.json({ success: true });
}
