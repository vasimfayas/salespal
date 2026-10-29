import { prisma } from "@/lib/prisma";
import { EMAIL_DEFAULTS, type EmailTemplate, type EmailTemplateKey } from "@/lib/email-templates";

/** Owner and super admin write each company's email wording. */
export const EMAIL_TEMPLATE_EDITOR_ROLES = [1, 6];

/** The company's saved template, or the built-in default. `custom` says which. */
export async function getEmailTemplate(orgId: number, key: EmailTemplateKey): Promise<EmailTemplate & { custom: boolean }> {
  const row = await prisma.emailTemplate.findUnique({ where: { org_id_key: { org_id: orgId, key } }, select: { subject: true, body: true } });
  return row ? { ...row, custom: true } : { ...EMAIL_DEFAULTS[key], custom: false };
}
