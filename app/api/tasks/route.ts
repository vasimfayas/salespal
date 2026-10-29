import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { clientScopeWhere, taskScopeWhere, hasRole } from "@/lib/scoping";
import { TODO_CATEGORY } from "@/lib/task-privacy";
import { taskCategories, type TaskCategory } from "@/types/task";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await prisma.task.findMany({ where: await taskScopeWhere(token), include: { assignedTo: { select: { name: true } }, createdBy: { select: { name: true } } }, orderBy: { due_date: "asc" } });
  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  // Everyone can add a personal to-do: private to them, so there is never an assignee to pick. Only owners and managers
  // assign other task types to someone else; with no assignee a task is the user's own.
  // Record-linked task types are for the roles that work with clients; everyone else only gets to-dos.
  const requested = taskCategories.includes(body.category) ? (body.category as TaskCategory) : null;
  const category = hasRole(token, [1, 2, 3]) ? requested : TODO_CATEGORY;
  const canAssign = hasRole(token, [1, 2]) && category !== TODO_CATEGORY;
  const assignedToId = canAssign && body.assigned_to_id ? Number(body.assigned_to_id) : Number(token.id);
  if (!Number.isInteger(assignedToId)) return NextResponse.json({ error: "Select who the task is for" }, { status: 400 });

  const description = typeof body.description === "string" ? body.description.trim().slice(0, 500) : "";
  const dueDate = new Date(body.due_date);
  if (!description) return NextResponse.json({ error: "Task description is required" }, { status: 400 });
  if (Number.isNaN(dueDate.getTime())) return NextResponse.json({ error: "Enter a valid due date" }, { status: 400 });

  // A client follow-up is about one of the user's clients.
  let clientId: number | null = null;
  if (category === "client_follow_up") {
    const client = await prisma.client.findFirst({ where: { AND: [{ id: Number(body.client_id) }, await clientScopeWhere(token)] }, select: { id: true } });
    if (!client) return NextResponse.json({ error: "Select the client to follow up" }, { status: 400 });
    clientId = client.id;
  }

  const task = await prisma.task.create({
    data: {
      assigned_to_id: assignedToId,
      created_by_id: Number(token.id),
      description,
      due_date: dueDate,
      notification: Boolean(body.notification),
      status: body.status ?? "pending",
      category,
      client_id: clientId,
    },
  });
  revalidateTag("salesman-dashboard", { expire: 0 });
  revalidateTag("salesman-tasks", { expire: 0 });
  revalidateTag("salesman-clients", { expire: 0 });
  revalidateTag("manager-dashboard", { expire: 0 });
  revalidateTag("manager-tasks", { expire: 0 });
  return NextResponse.json({ task }, { status: 201 });
}
