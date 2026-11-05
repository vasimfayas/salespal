import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateEnquiryPages } from "@/lib/enquiries";
import { parseQuoteOption, quoteOptionAccess } from "@/lib/quote-options";

type Ctx = { params: Promise<{ id: string; optionId: string }> };

async function load(request: NextRequest, context: Ctx) {
  const { id, optionId } = await context.params;
  const access = await quoteOptionAccess(request, Number(id));
  if (access.error !== undefined) return { error: access.error, status: access.status } as const;
  const option = await prisma.enquiryQuoteOption.findFirst({ where: { id: Number(optionId), enquiry_id: access.enquiry.id }, select: { id: true, agent_id: true } });
  if (!option) return { error: "Quote not found", status: 404 } as const;
  return { enquiry: access.enquiry, option } as const;
}

/** Change an agent quote. If it's the one in use, the enquiry keeps the old figures until it's chosen again (requote). */
export async function PATCH(request: NextRequest, context: Ctx) {
  const found = await load(request, context);
  if (found.error !== undefined) return NextResponse.json({ error: found.error }, { status: found.status });
  const parsed = await parseQuoteOption(await request.json().catch(() => ({})), found.enquiry.org_id, found.option.agent_id);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  await prisma.enquiryQuoteOption.update({ where: { id: found.option.id }, data: parsed.data });
  revalidateEnquiryPages();
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest, context: Ctx) {
  const found = await load(request, context);
  if (found.error !== undefined) return NextResponse.json({ error: found.error }, { status: found.status });
  if (found.enquiry.selected_quote_option_id === found.option.id) {
    return NextResponse.json({ error: "This is the quote in use. Choose another one before deleting it." }, { status: 409 });
  }
  await prisma.enquiryQuoteOption.delete({ where: { id: found.option.id } });
  revalidateEnquiryPages();
  return NextResponse.json({ ok: true });
}
