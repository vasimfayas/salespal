import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { getTokenUserId, isRole } from "@/lib/scoping";
import { enquiryScopeWhere, revalidateEnquiryPages } from "@/lib/enquiries";
import { agentEnquirySelect, agentQuotePath, agentQuoteUrl, newAgentToken, sendAgentRequestEmail } from "@/lib/enquiry-agent";
import { enquiryRef } from "@/types/enquiry";

/** Statuses an enquiry can be sent to an agent from (again, to ask another agent). */
const SENDABLE = ["inquiry_received", "with_agent"];

/**
 * "Send to agent" (body: agent_id): emails the agent the shipment details with a link to add their cost,
 * and moves the enquiry to "With agent". Responds with the link too, to share by hand when email is off or fails.
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isRole(token, [2, 3])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const enquiry = await prisma.enquiry.findFirst({
    where: { AND: [{ id: Number((await context.params).id) }, await enquiryScopeWhere(token)] },
    select: { ...agentEnquirySelect, status: true },
  });
  if (!enquiry) return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  if (!SENDABLE.includes(enquiry.status)) return NextResponse.json({ error: "Only an enquiry that isn't quoted yet can be sent to an agent" }, { status: 409 });
  const agent = await prisma.agent.findUnique({ where: { id: Number(body.agent_id) } });
  if (!agent) return NextResponse.json({ error: "Select an agent" }, { status: 400 });

  const userId = getTokenUserId(token);
  const agentToken = newAgentToken();
  const sender = await prisma.$transaction(async (tx) => {
    await tx.enquiryAgentRequest.create({ data: { enquiry_id: enquiry.id, agent_id: agent.id, token: agentToken, sent_by_id: userId } });
    if (enquiry.status !== "with_agent") await tx.enquiry.update({ where: { id: enquiry.id }, data: { status: "with_agent" } });
    await tx.enquiryEvent.create({
      data: { enquiry_id: enquiry.id, action: "sent_to_agent", from_status: enquiry.status, to_status: "with_agent", note: `Sent to ${agent.name} (${agent.email})`, created_by_id: userId },
    });
    return tx.user.findUniqueOrThrow({ where: { id: userId }, select: { name: true } });
  });
  revalidateEnquiryPages();

  const ref = enquiryRef(enquiry.id, enquiry.organization.prefix);
  const url = agentQuoteUrl(agentToken, request.url);
  let emailed = false;
  let emailError: string | null = null;
  try {
    emailed = await sendAgentRequestEmail({ to: agent.email, contactName: agent.contact_person, ref, enquiry, senderName: sender.name, url });
  } catch (err) {
    console.error("Agent rate request email failed:", err);
    emailError = "The email couldn't be sent. Share the link with the agent instead.";
  }
  return NextResponse.json({ ref, agent: agent.name, email: agent.email, url, path: agentQuotePath(agentToken), emailed, email_error: emailError }, { status: 201 });
}
