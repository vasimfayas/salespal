import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { getTokenUserId, hasRole } from "@/lib/scoping";
import { enquiryScopeWhere, revalidateEnquiryPages } from "@/lib/enquiries";
import { ENQUIRY_FIELD_LABELS, enquiryDetailsData, parseEnquiryDetails, type EnquiryDetails } from "@/lib/enquiry-fields";
import { packagesKey, readPackages } from "@/lib/freight";

/**
 * Edit an enquiry's shipment details (salesmen / managers) while it isn't confirmed.
 * Client, cost / profit and status are not editable here: figures go through Quote / Offer revised
 * so the history keeps the old values. Each edit is logged as an "edited" event listing the fields changed.
 */
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasRole(token, [2, 3])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await context.params;
  const enquiry = await prisma.enquiry.findFirst({ where: { AND: [{ id: Number(id) }, await enquiryScopeWhere(token)] } });
  if (!enquiry) return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  if (enquiry.status === "confirmed") return NextResponse.json({ error: "A confirmed enquiry can't be edited" }, { status: 409 });
  if (enquiry.status === "sent_to_client") return NextResponse.json({ error: "The client is still filling in this form. Edit it once they submit." }, { status: 409 });

  const body = await request.json().catch(() => ({}));
  const details = parseEnquiryDetails(body);
  if ("error" in details) return NextResponse.json({ error: details.error }, { status: 400 });
  const needsApproval = typeof body.needs_approval === "boolean" ? body.needs_approval : enquiry.needs_approval;

  // Dates by time, Decimals (weight / CBM) by value, packing lists by content, everything else as-is.
  const comparable = (v: unknown) => (v instanceof Date ? v.getTime() : v instanceof Prisma.Decimal ? v.toNumber() : v);
  const same = (key: keyof EnquiryDetails) =>
    key === "packages"
      ? packagesKey(readPackages(enquiry.packages)) === packagesKey(details.data.packages)
      : key === "dimension_unit" && !enquiry.packages && !details.data.packages
        ? true // the unit only matters once there are dimensions
        : comparable(enquiry[key]) === comparable(details.data[key]);
  const changed: string[] = (Object.keys(details.data) as (keyof EnquiryDetails)[]).filter((key) => !same(key));
  if (needsApproval !== enquiry.needs_approval) changed.push("needs_approval");
  if (changed.length === 0) return NextResponse.json({ ok: true, changed: [] });
  const label = (key: string) => (key === "needs_approval" ? `manager approval (${needsApproval ? "on" : "off"})` : ENQUIRY_FIELD_LABELS[key as keyof EnquiryDetails]);

  await prisma.$transaction([
    prisma.enquiry.update({ where: { id: enquiry.id }, data: { ...enquiryDetailsData(details.data), needs_approval: needsApproval } }),
    prisma.enquiryEvent.create({
      data: {
        enquiry_id: enquiry.id,
        action: "edited",
        from_status: enquiry.status,
        to_status: enquiry.status,
        note: `Changed ${changed.map(label).join(", ")}`,
        created_by_id: getTokenUserId(token),
      },
    }),
  ]);

  revalidateEnquiryPages();
  return NextResponse.json({ ok: true, changed });
}
