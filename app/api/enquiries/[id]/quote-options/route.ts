import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenUserId } from "@/lib/scoping";
import { revalidateEnquiryPages } from "@/lib/enquiries";
import { parseQuoteOption, quoteOptionAccess } from "@/lib/quote-options";

/** Save one agent's quote for the enquiry: { agent_id, lines: [{ label, cost, selling }] }. Doesn't change the enquiry's quote. */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const access = await quoteOptionAccess(request, Number(id));
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
  const parsed = await parseQuoteOption(await request.json().catch(() => ({})), access.enquiry.org_id);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const option = await prisma.enquiryQuoteOption.create({
    data: { ...parsed.data, enquiry_id: access.enquiry.id, created_by_id: getTokenUserId(access.token) },
    select: { id: true },
  });
  revalidateEnquiryPages();
  return NextResponse.json({ option }, { status: 201 });
}
