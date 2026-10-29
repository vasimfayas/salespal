import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { getTokenUserId, hasRole } from "@/lib/scoping";
import { enquiryScopeWhere } from "@/lib/enquiries";
import { agentEnquirySelect, agentShipmentRows, AGENT_LINK_VALID_DAYS } from "@/lib/enquiry-agent";
import { EMAIL_DEFAULTS, isTemplateKey, templateProblem } from "@/lib/email-templates";
import { EMAIL_TEMPLATE_EDITOR_ROLES, getEmailTemplate } from "@/lib/email-templates-db";
import { companyLogoUrl } from "@/types/company";
import { enquiryRef } from "@/types/enquiry";

/**
 * A company's template for an email (query: org_id, key), or the built-in default. Any signed-in user may read it:
 * it is what "Send to agent" shows for review. With `enquiry_id` (in the user's scope) it also returns that enquiry's
 * shipment rows and the sender, so the review can preview the real email.
 */
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const q = request.nextUrl.searchParams;
  const orgId = Number(q.get("org_id"));
  const key = q.get("key");
  if (!Number.isInteger(orgId) || !isTemplateKey(key)) return NextResponse.json({ error: "Unknown template" }, { status: 400 });

  const template = await getEmailTemplate(orgId, key);
  const enquiryId = Number(q.get("enquiry_id"));
  let context = null;
  if (Number.isInteger(enquiryId) && enquiryId > 0) {
    const [enquiry, sender] = await Promise.all([
      prisma.enquiry.findFirst({ where: { AND: [{ id: enquiryId }, await enquiryScopeWhere(token)] }, select: agentEnquirySelect }),
      prisma.user.findUnique({ where: { id: getTokenUserId(token) }, select: { name: true } }),
    ]);
    if (enquiry) context = { company: enquiry.organization.name, ref: enquiryRef(enquiry.id, enquiry.organization.prefix), sender: sender?.name ?? "", logo_src: companyLogoUrl(enquiry.organization), shipment: agentShipmentRows(enquiry), valid_days: AGENT_LINK_VALID_DAYS };
  }
  return NextResponse.json({ template, default: EMAIL_DEFAULTS[key], context });
}

/** Saves a company's template (body: org_id, key, subject, body). Owner / super admin. */
export async function PUT(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !hasRole(token, EMAIL_TEMPLATE_EDITOR_ROLES)) return NextResponse.json({ error: "Only the owner can edit email templates" }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const orgId = Number(body.org_id);
  if (!Number.isInteger(orgId) || !isTemplateKey(body.key) || typeof body.subject !== "string" || typeof body.body !== "string") return NextResponse.json({ error: "Invalid template" }, { status: 400 });
  const t = { subject: body.subject.trim(), body: body.body.replace(/\r\n/g, "\n").trim() };
  const problem = templateProblem(t);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });
  if (!(await prisma.organization.count({ where: { id: orgId } }))) return NextResponse.json({ error: "Company not found" }, { status: 404 });
  const userId = getTokenUserId(token);
  await prisma.emailTemplate.upsert({
    where: { org_id_key: { org_id: orgId, key: body.key } },
    create: { org_id: orgId, key: body.key, ...t, updated_by_id: userId },
    update: { ...t, updated_by_id: userId },
  });
  return NextResponse.json({ ok: true });
}

/** Back to the built-in wording (query: org_id, key). Owner / super admin. */
export async function DELETE(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !hasRole(token, EMAIL_TEMPLATE_EDITOR_ROLES)) return NextResponse.json({ error: "Only the owner can edit email templates" }, { status: 403 });
  const q = request.nextUrl.searchParams;
  const key = q.get("key");
  if (!isTemplateKey(key)) return NextResponse.json({ error: "Unknown template" }, { status: 400 });
  await prisma.emailTemplate.deleteMany({ where: { org_id: Number(q.get("org_id")), key } });
  return NextResponse.json({ ok: true });
}
