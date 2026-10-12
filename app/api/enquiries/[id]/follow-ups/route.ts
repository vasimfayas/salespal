import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { getTokenUserId, hasRole } from "@/lib/scoping";
import { enquiryScopeWhere, revalidateEnquiryPages } from "@/lib/enquiries";
import { isActiveEnquiry } from "@/types/enquiry";
import { extendFollowUpTasks, nextFollowUpDate, revalidateTaskViews } from "@/lib/enquiry-follow-ups";
import { parseDateOnly } from "@/lib/salesman-targets";

/**
 * Salesman / manager logs a follow-up comment on an open enquiry, with the date to follow up next (body: comment,
 * next_date YYYY-MM-DD; default 30 days). The open follow-up task moves to that date — it stays open until the
 * enquiry becomes an order — and the next automatic follow-up is due then too.
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasRole(token, [2, 3])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await context.params;
  const body = await request.json();
  const comment = String(body.comment ?? "").trim();
  if (!comment) return NextResponse.json({ error: "Write a follow-up comment" }, { status: 400 });
  if (comment.length > 2000) return NextResponse.json({ error: "Comment is too long (max 2000 characters)" }, { status: 400 });
  const nextDate = body.next_date ? parseDateOnly(body.next_date) : nextFollowUpDate();
  if (!nextDate || nextDate < new Date(new Date().toISOString().slice(0, 10))) {
    return NextResponse.json({ error: "Pick a next follow-up date from today onwards" }, { status: 400 });
  }

  const enquiry = await prisma.enquiry.findFirst({
    where: { AND: [{ id: Number(id) }, await enquiryScopeWhere(token)] },
  });
  if (!enquiry) return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  if (!isActiveEnquiry(enquiry.status)) {
    return NextResponse.json({ error: "Follow-ups can only be added to enquiries that are still in progress" }, { status: 409 });
  }

  const followUp = await prisma.$transaction(async (tx) => {
    const created = await tx.enquiryFollowUp.create({
      data: { enquiry_id: enquiry.id, comment, created_by_id: getTokenUserId(token) },
    });
    await tx.enquiry.update({ where: { id: enquiry.id }, data: { next_follow_up_at: nextDate } });
    await extendFollowUpTasks(tx, enquiry.id, nextDate, { note: comment, by: getTokenUserId(token) });
    return created;
  });

  revalidateEnquiryPages();
  revalidateTaskViews();
  return NextResponse.json({ follow_up: { id: followUp.id } }, { status: 201 });
}
