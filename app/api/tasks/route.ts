import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { clientScopeWhere, taskScopeWhere, hasRole } from "@/lib/scoping";
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
  if (!hasRole(token, [1, 2, 3])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const assignedToId = token.role_id === 3 ? Number(token.id) : Number(body.assigned_to_id);
  const category = taskCategories.includes(body.category) ? (body.category as TaskCategory) : null;

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
      description: body.description,
      due_date: new Date(body.due_date),
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
