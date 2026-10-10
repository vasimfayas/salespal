import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateEnquiryPages } from "@/lib/enquiries";
import { agentLinkExpired } from "@/lib/enquiry-agent";

/**
 * Public (no sign-in; the link token is the credential): an agent gives their cost for an enquiry they were sent.
 * Body: cost (> 0), notes? (validity, transit time…). One reply per link.
 */
export async function POST(req: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const request = await prisma.enquiryAgentRequest.findUnique({
    where: { token },
    select: { id: true, enquiry_id: true, sent_at: true, replied_at: true, sent_by_id: true, agent: { select: { name: true } }, enquiry: { select: { status: true } } },
  });
  if (!request || agentLinkExpired(request.sent_at)) return NextResponse.json({ error: "This link has expired or is no longer valid." }, { status: 404 });
  if (request.replied_at) return NextResponse.json({ error: "You've already sent your cost for this enquiry." }, { status: 409 });
  if (!["inquiry_received", "with_agent"].includes(request.enquiry.status)) {
    return NextResponse.json({ error: "This enquiry isn't open for rates any more." }, { status: 409 });
  }

  const body = await req.json().catch(() => ({}));
  const cost = Number(body.cost);
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 2000) : "";
  if (!Number.isFinite(cost) || cost <= 0 || cost >= 1e10) return NextResponse.json({ error: "Enter your cost as a number above 0" }, { status: 400 });

  const saved = await prisma.$transaction(async (tx) => {
    // Conditional on no reply yet, so a double submit can't record twice.
    const { count } = await tx.enquiryAgentRequest.updateMany({
      where: { id: request.id, replied_at: null },
      data: { cost: Math.round(cost * 100) / 100, notes: notes || null, replied_at: new Date() },
    });
    if (!count) return false;
    await tx.enquiryEvent.create({
      data: {
        enquiry_id: request.enquiry_id,
        action: "agent_replied",
        cost: Math.round(cost * 100) / 100,
        note: `${request.agent.name}${notes ? ` — ${notes.slice(0, 200)}` : ""}`,
        created_by_id: request.sent_by_id,
      },
    });
    return true;
  });
  if (!saved) return NextResponse.json({ error: "You've already sent your cost for this enquiry." }, { status: 409 });
  revalidateEnquiryPages();
  return NextResponse.json({ ok: true });
}
