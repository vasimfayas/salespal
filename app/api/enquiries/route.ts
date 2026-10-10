import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { getTokenUserId, isRole } from "@/lib/scoping";
import { applyClientStatus, revalidateClientViews } from "@/lib/client-status-flow";
import { getEnquiriesPage, resolveEnquiryClient, revalidateEnquiryPages } from "@/lib/enquiries";
import { enquiryDetailsData, parseEnquiryDetails } from "@/lib/enquiry-fields";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Paginated like the UI: ?page=&status=&q=
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const { rows, total, page, pageSize, counts } = await getEnquiriesPage(token, params);
  return NextResponse.json({ enquiries: rows, total, page, pageSize, counts });
}


/**
 * Salesmen and managers raise enquiries. Cost and profit are optional: with both the enquiry
 * starts as "quoted", otherwise as "inquiry_received" (quote it later).
 */
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isRole(token, [2, 3])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const clientId = Number(body.client_id);
  const blank = (v: unknown) => v === undefined || v === null || v === "";
  const hasQuote = !blank(body.provisional_cost) || !blank(body.provisional_profit);
  const cost = hasQuote ? Number(body.provisional_cost) : null;
  const profit = hasQuote ? Number(body.provisional_profit) : null;

  if (!Number.isInteger(clientId)) return NextResponse.json({ error: "Select a client" }, { status: 400 });
  const details = parseEnquiryDetails(body);
  if ("error" in details) return NextResponse.json({ error: details.error }, { status: 400 });
  if (hasQuote) {
    if (blank(body.provisional_cost) || !Number.isFinite(cost) || cost! < 0) return NextResponse.json({ error: "Enter both cost and profit, or leave both empty" }, { status: 400 });
    if (blank(body.provisional_profit) || !Number.isFinite(profit)) return NextResponse.json({ error: "Enter both cost and profit, or leave both empty" }, { status: 400 });
  }

  const resolved = await resolveEnquiryClient(token, clientId, body.org_id);
  if ("error" in resolved) return NextResponse.json({ error: resolved.error, ...("extra" in resolved ? resolved.extra : {}) }, { status: resolved.status });
  const { client, orgId, nextStatus } = resolved;

  const enquiry = await prisma.$transaction(async (tx) => {
    const created = await tx.enquiry.create({
      data: {
        client_id: clientId,
        org_id: orgId,
        ...enquiryDetailsData(details.data),
        provisional_cost: cost,
        provisional_profit: profit,
        status: hasQuote ? "quoted" : "inquiry_received",
        created_by_id: getTokenUserId(token),
      },
    });
    await tx.enquiryEvent.create({
      data: {
        enquiry_id: created.id,
        action: hasQuote ? "quoted" : "inquiry_received",
        to_status: hasQuote ? "quoted" : "inquiry_received",
        cost,
        profit,
        created_by_id: getTokenUserId(token),
      },
    });
    if (nextStatus) {
      // A dormant client coming back isn't a new onboarding, so no KPI entry for it.
      await applyClientStatus(tx, client, nextStatus, getTokenUserId(token), {
        kpi: nextStatus === "enquiry",
        reason: "enquiry raised",
      });
    }
    return created;
  });

  revalidateEnquiryPages();
  if (nextStatus) revalidateClientViews();
  return NextResponse.json({ enquiry: { id: enquiry.id, status: enquiry.status }, client_status: nextStatus }, { status: 201 });
}
