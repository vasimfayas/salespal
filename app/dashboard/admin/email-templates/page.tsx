import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmailTemplatesClient } from "@/components/email/EmailTemplatesClient";
import { getSalesPalSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EMAIL_TEMPLATE_KEYS } from "@/lib/email-templates";
import { EMAIL_TEMPLATE_EDITOR_ROLES, getEmailTemplate } from "@/lib/email-templates-db";
import { companyLogoUrl } from "@/types/company";
import { param, type SearchParams } from "@/lib/list-params";

/** Owner / super admin: each company's wording for the emails the system sends. */
export default async function EmailTemplatesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await getSalesPalSession();
  if (!session || !EMAIL_TEMPLATE_EDITOR_ROLES.includes(session.user.role_id)) redirect("/dashboard/admin");

  const orgParam = param(await searchParams, "org");
  const companies = await prisma.organization.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, logo_path: true } });
  const orgId = companies.find((c) => String(c.id) === orgParam)?.id ?? companies[0]?.id;
  const templates = orgId ? await Promise.all(EMAIL_TEMPLATE_KEYS.map(async (key) => [key, await getEmailTemplate(orgId, key)] as const)) : [];

  return (
    <>
      <PageHeader title="Email templates" subtitle="Each company's own wording for the emails the system sends. Placeholders like {{ref}} are filled in when an email goes out." />
      <EmailTemplatesClient companies={companies.map(({ logo_path, ...c }) => ({ ...c, logo_src: companyLogoUrl({ id: c.id, logo_path }) }))} orgId={orgId ?? null} templates={Object.fromEntries(templates)} />
    </>
  );
}
