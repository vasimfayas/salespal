import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/scoping";
import { AGENT_EDITOR_ROLES, AGENT_LOCK_ROLES, parseAgent } from "@/lib/agents";

type Params = { params: Promise<{ id: string }> };

/** Body `{ locked }` alone locks / unlocks (owner, managers, accounts); anything else is a full edit (owner, managers). */
export async function PATCH(request: NextRequest, context: Params) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const id = Number((await context.params).id);
  const body = await request.json();
  if (typeof body.locked === "boolean" && Object.keys(body).length === 1) {
    if (!token || !hasRole(token, AGENT_LOCK_ROLES)) return NextResponse.json({ error: "You can't lock agents" }, { status: 403 });
    const { count } = await prisma.agent.updateMany({ where: { id }, data: { locked: body.locked } });
    if (!count) return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    revalidatePath("/dashboard", "layout");
    return NextResponse.json({ ok: true });
  }
  if (!token || !hasRole(token, AGENT_EDITOR_ROLES)) return NextResponse.json({ error: "Only managers can edit agents" }, { status: 403 });
  const parsed = parseAgent(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { count } = await prisma.agent.updateMany({ where: { id }, data: parsed.data });
  if (!count) return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  revalidatePath("/dashboard", "layout");
  return NextResponse.json({ ok: true });
}

/** Only agents never sent an enquiry can be deleted, so rate history stays intact. */
export async function DELETE(request: NextRequest, context: Params) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !hasRole(token, AGENT_EDITOR_ROLES)) return NextResponse.json({ error: "Only managers can delete agents" }, { status: 403 });
  const id = Number((await context.params).id);
  if (await prisma.enquiryAgentRequest.count({ where: { agent_id: id } })) {
    return NextResponse.json({ error: "This agent has rate requests on enquiries, so it can't be deleted" }, { status: 409 });
  }
  const { count } = await prisma.agent.deleteMany({ where: { id } });
  if (!count) return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  revalidatePath("/dashboard", "layout");
  return NextResponse.json({ ok: true });
}
