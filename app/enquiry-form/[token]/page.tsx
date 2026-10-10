import type { Metadata } from "next";
import { CheckCircle2, LinkIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { clientFormExpired } from "@/lib/enquiry-client-form";
import { ClientEnquiryForm } from "@/components/enquiries/ClientEnquiryForm";
import { CompanyLogo } from "@/components/companies/CompanyLogo";
import { companyLogoUrl } from "@/types/company";
import { clientLabel } from "@/types/client";
import { enquiryRef } from "@/types/enquiry";
import { formatDate } from "@/lib/utils";

// The link token is the only credential: keep these pages out of search engines and link previews' caches.
export const metadata: Metadata = { title: "Freight enquiry form", robots: { index: false, follow: false } };

/** Public: the fillable enquiry form a client opens from the "Send to client" email. */
export default async function ClientEnquiryFormPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const enquiry = await prisma.enquiry.findUnique({
    where: { client_form_token: token },
    select: {
      id: true,
      status: true,
      client_form_sent_at: true,
      client_signed_at: true,
      client: { select: { name: true, department: true, contact_person_name: true } },
      organization: { select: { id: true, name: true, prefix: true, logo_path: true } },
    },
  });
  const submitted = enquiry && enquiry.status !== "sent_to_client";
  const valid = enquiry && (submitted || !clientFormExpired(enquiry.client_form_sent_at));

  return (
    <main className="min-h-dvh bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        {enquiry && valid && (
          <header className="flex items-center gap-4">
            <CompanyLogo url={companyLogoUrl(enquiry.organization)} name={enquiry.organization.name} className="size-14" />
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{enquiry.organization.name}</p>
              <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Freight enquiry form</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {enquiryRef(enquiry.id, enquiry.organization.prefix)} · for {clientLabel(enquiry.client)}
              </p>
            </div>
          </header>
        )}

        {!enquiry || !valid ? (
          <Notice icon={<LinkIcon className="size-8 text-muted-foreground" aria-hidden />} title="This link isn't valid any more">
            It may have expired or been mistyped. Ask your contact to send you a new enquiry form.
          </Notice>
        ) : submitted ? (
          <Notice icon={<CheckCircle2 className="size-8 text-success-foreground" aria-hidden />} title="This form has been submitted">
            {enquiry.client_signed_at ? `Signed on ${formatDate(enquiry.client_signed_at)}. ` : ""}
            {enquiry.organization.name} will be in touch with a quote.
          </Notice>
        ) : (
          <ClientEnquiryForm
            token={token}
            companyName={enquiry.organization.name}
            defaultSigner={enquiry.client.contact_person_name && enquiry.client.contact_person_name !== "-" ? enquiry.client.contact_person_name : ""}
          />
        )}
      </div>
    </main>
  );
}

function Notice({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-border bg-card p-8 text-center shadow-card">
      <div className="flex justify-center">{icon}</div>
      <h2 className="mt-3 text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
