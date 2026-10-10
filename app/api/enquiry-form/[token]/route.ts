import path from "node:path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateEnquiryPages } from "@/lib/enquiries";
import { enquiryDetailsData, parseEnquiryDetails } from "@/lib/enquiry-fields";
import { clientFormExpired } from "@/lib/enquiry-client-form";
import { removeDocumentFile, storeUploadedFile } from "@/lib/company-documents";

const SIGNATURE_PREFIX = "data:image/png;base64,";
const MAX_SIGNATURE_BYTES = 300 * 1024;

/**
 * Public (no sign-in; the link token is the credential): the client submits the enquiry form they were sent.
 * Body: the shipment fields of the enquiry form, signed_name, signature (PNG data URL).
 * Payment terms and the quote stay with the sales team, so they're not taken from here.
 */
export async function POST(req: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const enquiry = await prisma.enquiry.findUnique({
    where: { client_form_token: token },
    select: { id: true, status: true, enquiry_date: true, payment_mode: true, credit_days: true, client_form_sent_at: true, created_by_id: true },
  });
  if (!enquiry || clientFormExpired(enquiry.client_form_sent_at)) {
    return NextResponse.json({ error: "This link has expired or is no longer valid. Ask your contact for a new one." }, { status: 404 });
  }
  if (enquiry.status !== "sent_to_client") return NextResponse.json({ error: "This form has already been submitted." }, { status: 409 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
  const details = parseEnquiryDetails({
    ...body,
    enquiry_date: enquiry.enquiry_date.toISOString().slice(0, 10),
    payment_mode: enquiry.payment_mode,
    credit_days: enquiry.credit_days,
  });
  if ("error" in details) return NextResponse.json({ error: details.error }, { status: 400 });

  const signedName = String(body.signed_name ?? "").trim();
  if (signedName.length < 2 || signedName.length > 120) return NextResponse.json({ error: "Type your full name to sign" }, { status: 400 });
  const signature = typeof body.signature === "string" && body.signature.startsWith(SIGNATURE_PREFIX) ? Buffer.from(body.signature.slice(SIGNATURE_PREFIX.length), "base64") : null;
  // A PNG starts with these 8 bytes; anything else (or an empty / oversized image) is refused.
  const isPng = signature && signature.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (!signature || !isPng || signature.length < 100 || signature.length > MAX_SIGNATURE_BYTES) {
    return NextResponse.json({ error: "Sign in the signature box" }, { status: 400 });
  }

  const stored = await storeUploadedFile(path.join("enquiries", String(enquiry.id)), new File([new Uint8Array(signature)], "signature.png", { type: "image/png" }));
  const submitted = await prisma.$transaction(async (tx) => {
    // Conditional on the status so a double submit can't apply twice.
    const { count } = await tx.enquiry.updateMany({
      where: { id: enquiry.id, status: "sent_to_client" },
      data: {
        ...enquiryDetailsData(details.data),
        status: "inquiry_received",
        client_signed_name: signedName,
        client_signed_at: new Date(),
        client_signature_path: stored.file_path,
      },
    });
    if (count === 0) return false;
    await tx.enquiryEvent.create({
      data: {
        enquiry_id: enquiry.id,
        action: "client_submitted",
        from_status: "sent_to_client",
        to_status: "inquiry_received",
        note: `Signed by ${signedName}`,
        created_by_id: enquiry.created_by_id,
      },
    });
    return true;
  });
  if (!submitted) {
    await removeDocumentFile(stored.file_path);
    return NextResponse.json({ error: "This form has already been submitted." }, { status: 409 });
  }

  revalidateEnquiryPages();
  return NextResponse.json({ ok: true });
}
