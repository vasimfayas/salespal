"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { EmailTemplateEditor } from "@/components/email/EmailTemplateEditor";
import { EMAIL_DEFAULTS, EMAIL_TEMPLATE_KEYS, emailTemplateMeta, templateProblem, type EmailTemplate, type EmailTemplateKey, type EmailVars } from "@/lib/email-templates";
import { Mail } from "lucide-react";

type Saved = EmailTemplate & { custom: boolean };

const SAMPLE: EmailVars = {
  contact_name: "Ali Khan",
  company: "",
  ref: "SPA-ENQ-00012",
  sender: "Your name",
  link: "https://example.com/agent-quote/abc123",
  valid_days: 30,
  shipment: [["Mode", "Sea"], ["From", "Ningbo, China"], ["To", "Hamad Port, Qatar"], ["Equipment", "40'HC"], ["Gross weight", "18,400 kg"]],
};

/** One card per email type for the chosen company: edit, preview, save, or go back to the built-in wording. */
export function EmailTemplatesClient({ companies, orgId, templates }: { companies: { id: number; name: string; logo_src: string | null }[]; orgId: number | null; templates: Record<string, Saved> }) {
  const router = useRouter();
  if (!orgId) return <EmptyState icon={Mail} title="No companies yet" message="Add a company first; each one gets its own email wording." />;
  const company = companies.find((c) => c.id === orgId)!;
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <label htmlFor="tpl-company" className="text-sm font-medium text-foreground">
          Company
        </label>
        <select
          id="tpl-company"
          value={orgId}
          onChange={(e) => router.push(`/dashboard/admin/email-templates?org=${e.target.value}`)}
          className="h-9 cursor-pointer rounded-control border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none focus:border-ring focus:ring-3 focus:ring-ring/15"
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      {EMAIL_TEMPLATE_KEYS.map((key) => (
        <TemplateCard key={`${orgId}-${key}`} orgId={orgId} templateKey={key} saved={templates[key]} companyName={company.name} logoSrc={company.logo_src} />
      ))}
    </div>
  );
}

function TemplateCard({ orgId, templateKey, saved, companyName, logoSrc }: { orgId: number; templateKey: EmailTemplateKey; saved: Saved; companyName: string; logoSrc: string | null }) {
  const router = useRouter();
  const meta = emailTemplateMeta[templateKey];
  const [draft, setDraft] = useState<EmailTemplate>({ subject: saved.subject, body: saved.body });
  const [busy, setBusy] = useState(false);
  const vars = useMemo(() => ({ ...SAMPLE, company: companyName, logo_src: logoSrc, shipment: templateKey === "agent_rate_request" ? SAMPLE.shipment : undefined }), [companyName, logoSrc, templateKey]);
  const dirty = draft.subject !== saved.subject || draft.body !== saved.body;
  const problem = templateProblem(draft);

  async function call(method: "PUT" | "DELETE") {
    setBusy(true);
    try {
      const res = await fetch(method === "PUT" ? "/api/email-templates" : `/api/email-templates?org_id=${orgId}&key=${templateKey}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "PUT" ? JSON.stringify({ org_id: orgId, key: templateKey, ...draft }) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't save the template");
      if (method === "DELETE") setDraft(EMAIL_DEFAULTS[templateKey]);
      toast.success(method === "PUT" ? "Template saved" : "Back to the default wording");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save the template");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-4 rounded-card border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            {meta.label}
            <span className={saved.custom ? "rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary-soft-foreground" : "rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"}>
              {saved.custom ? "Customised" : "Default"}
            </span>
          </h2>
          <p className="text-sm text-muted-foreground">{meta.description}</p>
        </div>
      </div>
      <EmailTemplateEditor templateKey={templateKey} subject={draft.subject} body={draft.body} onChange={setDraft} vars={vars} />
      {dirty && problem && (
        <p role="alert" className="text-sm font-medium text-danger-foreground">
          {problem}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        {(saved.custom || dirty) && (
          <Button type="button" variant="secondary" size="sm" disabled={busy} onClick={() => (saved.custom ? call("DELETE") : setDraft(EMAIL_DEFAULTS[templateKey]))}>
            <RotateCcw /> Reset to default
          </Button>
        )}
        <Button type="button" size="sm" loading={busy} disabled={!dirty || !!problem} onClick={() => call("PUT")}>
          Save
        </Button>
      </div>
    </section>
  );
}
