import type { Metadata } from "next";
import { CheckCircle2, LinkIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { agentEnquirySelect, agentLinkExpired, agentShipmentRows } from "@/lib/enquiry-agent";
import { AgentQuoteForm } from "@/components/agents/AgentQuoteForm";
import { CompanyLogo } from "@/components/companies/CompanyLogo";
import { companyLogoUrl } from "@/types/company";
import { enquiryRef } from "@/types/enquiry";
import { formatAmount, formatDate } from "@/lib/utils";

// The link token is the only credential: keep these pages out of search engines.
export const metadata: Metadata = { title: "Rate request", robots: { index: false, follow: false } };

/** Public: the shipment an agent was asked to price ("Send to agent"), with a form for their cost. */
export default async function AgentQuotePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const request = await prisma.enquiryAgentRequest.findUnique({
    where: { token },
    select: { sent_at: true, cost: true, replied_at: true, agent: { select: { name: true } }, enquiry: { select: { ...agentEnquirySelect, status: true } } },
  });
  const valid = request && (request.replied_at || !agentLinkExpired(request.sent_at));
  const open = request && ["inquiry_received", "with_agent"].includes(request.enquiry.status);

  return (
    <main className="min-h-dvh bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        {!request || !valid ? (
          <Notice icon={<LinkIcon className="size-8 text-muted-foreground" aria-hidden />} title="This link isn't valid any more">
            It may have expired or been mistyped. Ask your contact to send the request again.
          </Notice>
        ) : (
          <>
            <header className="flex items-center gap-4">
              <CompanyLogo url={companyLogoUrl(request.enquiry.organization)} name={request.enquiry.organization.name} className="size-14" />
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{request.enquiry.organization.name}</p>
                <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Rate request</h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {enquiryRef(request.enquiry.id, request.enquiry.organization.prefix)} · for {request.agent.name}
                </p>
              </div>
            </header>

            <section aria-label="Shipment details" className="overflow-hidden rounded-card border border-border bg-card shadow-card">
              <h2 className="border-b border-border px-5 py-3 text-sm font-semibold text-foreground">Shipment</h2>
              <dl className="divide-y divide-border text-sm">
                {agentShipmentRows(request.enquiry).map(([k, v]) => (
                  <div key={k} className="grid gap-1 px-5 py-2.5 sm:grid-cols-[12rem_minmax(0,1fr)]">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="whitespace-pre-line text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {request.replied_at ? (
              <Notice icon={<CheckCircle2 className="size-8 text-success-foreground" aria-hidden />} title="Your cost was sent">
                {request.cost !== null ? `${formatAmount(request.cost.toNumber())} · ` : ""}sent on {formatDate(request.replied_at)}. Thank you.
              </Notice>
            ) : !open ? (
              <Notice icon={<LinkIcon className="size-8 text-muted-foreground" aria-hidden />} title="This enquiry is closed for rates">
                It has already been quoted or closed. Thank you for your time.
              </Notice>
            ) : (
              <AgentQuoteForm token={token} companyName={request.enquiry.organization.name} />
            )}
          </>
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
