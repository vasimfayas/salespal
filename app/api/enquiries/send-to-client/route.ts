import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { getTokenUserId, isRole } from "@/lib/scoping";
import { applyClientStatus, revalidateClientViews } from "@/lib/client-status-flow";
import { resolveEnquiryClient, revalidateEnquiryPages } from "@/lib/enquiries";
import { clientFormPath, clientFormUrl, newClientFormToken, sendClientFormEmail } from "@/lib/enquiry-client-form";
import { getEmailTemplate } from "@/lib/email-templates-db";
import { enquiryRef } from "@/types/enquiry";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Starts an enquiry as "Sent to client" and emails the client a fillable form link (body: client_id, org_id?, email).
 * The shipment details, signature and status come in when the client submits (POST /api/enquiry-form/<token>).
 * The email goes through the background queue; responds with its job id (poll /api/email-jobs) and the link, to share by hand when email is off or fails.
 */
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isRole(token, [2, 3])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const clientId = Number(body.client_id);
  const email = String(body.email ?? "").trim();
  if (!Number.isInteger(clientId)) return NextResponse.json({ error: "Select a client" }, { status: 400 });
  if (!EMAIL.test(email) || email.length > 254) return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });

  const resolved = await resolveEnquiryClient(token, clientId, body.org_id);
  if ("error" in resolved) return NextResponse.json({ error: resolved.error, ...("extra" in resolved ? resolved.extra : {}) }, { status: resolved.status });
  const { client, orgId, nextStatus } = resolved;
  const userId = getTokenUserId(token);
  const formToken = newClientFormToken();

  const enquiry = await prisma.$transaction(async (tx) => {
    // Placeholder shipment fields until the client fills them in; payment terms default like the internal form's.
    const created = await tx.enquiry.create({
      data: {
        client_id: clientId,
        org_id: orgId,
        enquiry_date: new Date(new Date().toISOString().slice(0, 10)),
        mode: "sea",
        from: "",
        to: "",
        payment_mode: "cash",
        status: "sent_to_client",
        created_by_id: userId,
        client_form_token: formToken,
        client_form_email: email,
        client_form_sent_at: new Date(),
      },
      include: { organization: { select: { name: true, prefix: true, logo_path: true } }, createdBy: { select: { name: true } } },
    });
    await tx.enquiryEvent.create({
      data: { enquiry_id: created.id, action: "sent_to_client", to_status: "sent_to_client", note: `Form sent to ${email}`, created_by_id: userId },
    });
    if (nextStatus) await applyClientStatus(tx, client, nextStatus, userId, { reason: "enquiry raised", source: "enquiry" });
    return created;
  });

  revalidateEnquiryPages();
  if (nextStatus) revalidateClientViews();

  const url = clientFormUrl(formToken, request);
  const emailJobId = await sendClientFormEmail({
    to: email,
    template: await getEmailTemplate(orgId, "client_enquiry_form"),
    logoPath: enquiry.organization.logo_path,
    contactName: client.contact_person_name,
    companyName: enquiry.organization.name,
    senderName: enquiry.createdBy.name,
    ref: enquiryRef(enquiry.id, enquiry.organization.prefix),
    url,
  });

  return NextResponse.json(
    { enquiry: { id: enquiry.id, ref: enquiryRef(enquiry.id, enquiry.organization.prefix) }, url, path: clientFormPath(formToken), email_job_id: emailJobId },
    { status: 201 },
  );
}
