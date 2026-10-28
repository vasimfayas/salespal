import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { canAccessSalesman, clientScopeWhere } from "@/lib/scoping";
import { clientTasksWhere } from "@/lib/client-tasks";
import { taskCategories, type TaskCategory } from "@/types/task";

/** A task about one client (what used to be the separate client_tasks table). */
const CLIENT_TASK = "client_follow_up";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const clientId = Number(id);

  const client = await prisma.client.findFirst({
    where: { AND: [{ id: clientId }, await clientScopeWhere(token)] },
  });
  if (!client) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const tasks = await prisma.task.findMany({
    where: clientTasksWhere(clientId),
    include: {
      assignedTo: { select: { name: true } },
      createdBy: { select: { name: true } },
    },
    orderBy: { due_date: "asc" },
  });

  return NextResponse.json({ tasks });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const clientId = Number(id);

  const client = await prisma.client.findFirst({
    where: { AND: [{ id: clientId }, await clientScopeWhere(token)] },
  });
  if (!client) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const assignedToId = token.role_id === 3 ? Number(token.id) : Number(body.assigned_to_id || token.id);
  if (assignedToId !== Number(token.id) && !(await canAccessSalesman(token, assignedToId))) {
    return NextResponse.json({ error: "Pick a salesman from your team" }, { status: 403 });
  }
  // No category = a client follow-up; "general" = no type.
  const category: TaskCategory | null = body.category === "general" ? null : taskCategories.includes(body.category) ? body.category : CLIENT_TASK;

  const task = await prisma.task.create({
    data: {
      client_id: clientId,
      category,
      notification: Boolean(body.notification),
      assigned_to_id: assignedToId,
      created_by_id: Number(token.id),
      description: body.description,
      due_date: new Date(body.due_date),
      status: body.status ?? "pending",
    },
  });

  revalidateTag("salesman-dashboard", { expire: 0 });
  revalidateTag("salesman-clients", { expire: 0 });
  revalidateTag("salesman-tasks", { expire: 0 });
  revalidateTag("manager-dashboard", { expire: 0 });
  revalidateTag("manager-tasks", { expire: 0 });

  return NextResponse.json({ task }, { status: 201 });
}
