import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { isRole } from "@/lib/scoping";
import { AGENT_EDITOR_ROLES, parseAgent } from "@/lib/agents";

/** Every agent, by name (for the agents page and the "Send to agent" picker). */
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !isRole(token, [1, 2, 3])) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const agents = await prisma.agent.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ agents });
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !isRole(token, AGENT_EDITOR_ROLES)) return NextResponse.json({ error: "Only managers can add agents" }, { status: 403 });
  const parsed = parseAgent(await request.json());
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const agent = await prisma.agent.create({ data: parsed.data });
  revalidatePath("/dashboard", "layout");
  return NextResponse.json({ agent }, { status: 201 });
}
