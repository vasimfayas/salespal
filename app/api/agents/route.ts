import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/scoping";
import { AGENT_EDITOR_ROLES, agentForOrgWhere, parseAgent } from "@/lib/agents";
import { companiesExist } from "@/lib/agents-page";

/** Unlocked agents, by name (for the "Send to agent" picker). `?org_id=` keeps those that work for that company. */
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  // Operations too: they quote enquiries and pick the agent per quote line.
  if (!token || !hasRole(token, [1, 2, 3, 5])) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orgId = Number(new URL(request.url).searchParams.get("org_id"));
  const agents = await prisma.agent.findMany({ where: { locked: false, ...(orgId > 0 ? agentForOrgWhere(orgId) : {}) }, orderBy: [{ is_top: "desc" }, { name: "asc" }] });
  return NextResponse.json({ agents });
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !hasRole(token, AGENT_EDITOR_ROLES)) return NextResponse.json({ error: "Only managers can add agents" }, { status: 403 });
  const parsed = parseAgent(await request.json());
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  if (!(await companiesExist(parsed.orgIds))) return NextResponse.json({ error: "Select a valid company" }, { status: 400 });
  const agent = await prisma.agent.create({ data: { ...parsed.data, orgs: { create: parsed.orgIds.map((org_id) => ({ org_id })) } } });
  revalidatePath("/dashboard", "layout");
  return NextResponse.json({ agent }, { status: 201 });
}
