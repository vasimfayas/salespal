import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/scoping";
import { enquiryScopeWhere } from "@/lib/enquiries";
import { parseQuoteLines, quoteTotals } from "@/lib/quote-lines";
import { agentForOrgWhere } from "@/lib/agents";

/** Statuses an enquiry can still be (re)quoted from, so agent quotes can be added / changed. */
const OPEN = ["inquiry_received", "with_agent", "quoted", "revision_requested"];

/** Caller may price this enquiry (sales roles + operations, scoped). Returns the token and enquiry, or an error. */
export async function quoteOptionAccess(request: NextRequest, enquiryId: number) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return { error: "Unauthorized", status: 401 } as const;
  if (!hasRole(token, [1, 2, 3, 5])) return { error: "Forbidden", status: 403 } as const;
  const enquiry = await prisma.enquiry.findFirst({
    where: { AND: [{ id: enquiryId }, await enquiryScopeWhere(token)] },
    select: { id: true, org_id: true, status: true, selected_quote_option_id: true },
  });
  if (!enquiry) return { error: "Enquiry not found", status: 404 } as const;
  if (!OPEN.includes(enquiry.status)) return { error: "This enquiry can't be quoted any more", status: 409 } as const;
  return { token, enquiry } as const;
}

/**
 * { agent_id, lines } → what's stored on the option, or an error. The agent must work for the enquiry's company;
 * `currentAgentId` (editing an option) may stay even if it has since been unlinked.
 */
export async function parseQuoteOption(body: { agent_id?: unknown; lines?: unknown }, orgId: number, currentAgentId?: number | null) {
  const agentId = Number(body.agent_id);
  if (!Number.isInteger(agentId)) return { error: "Pick the agent" } as const;
  const agent = await prisma.agent.findFirst({ where: { id: agentId, ...(agentId === currentAgentId ? {} : agentForOrgWhere(orgId)) }, select: { id: true, name: true } });
  if (!agent) return { error: "That agent no longer exists or isn't linked to this company" } as const;
  const parsed = parseQuoteLines(body.lines);
  if ("error" in parsed) return { error: parsed.error } as const;
  const { cost, selling } = quoteTotals(parsed.lines);
  return { data: { agent_id: agent.id, agent_name: agent.name, lines: parsed.lines, cost, selling } } as const;
}
