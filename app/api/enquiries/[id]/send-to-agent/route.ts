import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { getTokenUserId, hasRole } from "@/lib/scoping";
import { enquiryScopeWhere, revalidateEnquiryPages } from "@/lib/enquiries";
import { agentEnquirySelect, agentQuotePath, agentQuoteUrl, newAgentToken, sendAgentRequestEmail } from "@/lib/enquiry-agent";
import { getEmailTemplate } from "@/lib/email-templates-db";
import { templateProblem } from "@/lib/email-templates";
import { enquiryRef } from "@/types/enquiry";

/** Statuses an enquiry can be sent to an agent from (again, to ask another agent). */
const SENDABLE = ["inquiry_received", "with_agent"];

/** Most agents one send can go to. */
const MAX_AGENTS = 25;

/**
 * "Send to agent" (body: agent_ids): each agent gets an email with the shipment details and a link to add their cost,
 * and the enquiry moves to "With agent". Responds with every link too, to share by hand when email is off or fails.
 * Optional `subject` + `body` reword the email for this send only (the company template is the default); {{placeholders}} fill in per agent.
 * Locked agents are refused, and unknown ones skipped, without stopping the rest.
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasRole(token, [2, 3])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const ids = [...new Set((Array.isArray(body.agent_ids) ? body.agent_ids : [body.agent_id]).map(Number).filter((n: number) => Number.isInteger(n) && n > 0))] as number[];
  if (ids.length === 0) return NextResponse.json({ error: "Select at least one agent" }, { status: 400 });
  if (ids.length > MAX_AGENTS) return NextResponse.json({ error: `Send to up to ${MAX_AGENTS} agents at a time` }, { status: 400 });

  const enquiry = await prisma.enquiry.findFirst({
    where: { AND: [{ id: Number((await context.params).id) }, await enquiryScopeWhere(token)] },
    select: { ...agentEnquirySelect, org_id: true, status: true },
  });
  if (!enquiry) return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  if (!SENDABLE.includes(enquiry.status)) return NextResponse.json({ error: "Only an enquiry that isn't quoted yet can be sent to an agent" }, { status: 409 });

  const found = await prisma.agent.findMany({ where: { id: { in: ids } } });
  const locked = found.filter((a) => a.locked);
  const agents = found.filter((a) => !a.locked);
  if (agents.length === 0) {
    return NextResponse.json({ error: locked.length ? `${locked.map((a) => a.name).join(", ")} ${locked.length === 1 ? "is" : "are"} locked. Ask a manager or accounts to unlock.` : "Select an agent" }, { status: locked.length ? 409 : 400 });
  }

  const edited = typeof body.subject === "string" && typeof body.body === "string" ? { subject: body.subject, body: body.body } : null;
  if (edited) {
    const problem = templateProblem(edited);
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });
  }
  const template = edited ?? (await getEmailTemplate(enquiry.org_id, "agent_rate_request"));

  const userId = getTokenUserId(token);
  const tokens = new Map(agents.map((a) => [a.id, newAgentToken()]));
  const sender = await prisma.$transaction(async (tx) => {
    await tx.enquiryAgentRequest.createMany({ data: agents.map((a) => ({ enquiry_id: enquiry.id, agent_id: a.id, token: tokens.get(a.id)!, sent_by_id: userId })) });
    if (enquiry.status !== "with_agent") await tx.enquiry.update({ where: { id: enquiry.id }, data: { status: "with_agent" } });
    await tx.enquiryEvent.create({
      data: { enquiry_id: enquiry.id, action: "sent_to_agent", from_status: enquiry.status, to_status: "with_agent", note: `Sent to ${agents.map((a) => `${a.name} (${a.email})`).join(", ")}`, created_by_id: userId },
    });
    return tx.user.findUniqueOrThrow({ where: { id: userId }, select: { name: true } });
  });
  revalidateEnquiryPages();

  const ref = enquiryRef(enquiry.id, enquiry.organization.prefix);
  // Queued for the worker (sent one at a time, with retries); the dialog polls /api/email-jobs for each result.
  const results = [];
  for (const agent of agents) {
    const agentToken = tokens.get(agent.id)!;
    const url = agentQuoteUrl(agentToken, request);
    const emailJobId = await sendAgentRequestEmail({ to: [agent.email, ...agent.extra_emails].join(", "), template, contactName: agent.contact_person, ref, enquiry, senderName: sender.name, url });
    results.push({ agent: agent.name, email: agent.email, url, path: agentQuotePath(agentToken), email_job_id: emailJobId });
  }
  return NextResponse.json({ ref, results, skipped_locked: locked.map((a) => a.name) }, { status: 201 });
}
