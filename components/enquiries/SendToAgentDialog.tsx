"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, MailWarning, RotateCcw, Search, Send, Star, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { EmailTemplateEditor } from "@/components/email/EmailTemplateEditor";
import { CopyLinkButton } from "@/components/enquiries/SendToClientDialog";
import { agentMatchesRoute } from "@/lib/agents";
import { useLocations } from "@/hooks/useLocations";
import { useEmailJobs } from "@/hooks/useEmailJobs";
import { templateProblem, type EmailTemplate, type EmailVars } from "@/lib/email-templates";
import { cn, titleCase } from "@/lib/utils";
import type { EnquiryListItem } from "@/types/enquiry";

type Agent = { id: number; name: string; contact_person: string | null; email: string; country: string | null; network: string | null; code: string | null; modes: string[]; is_top: boolean };
type MailContext = { logo_src: string | null; company: string; ref: string; sender: string; shipment: [string, string][]; valid_days: number };
type Sent = { agent: string; email: string; url: string; email_job_id: number };

/**
 * "Send to agent": pick one or more agents; each gets the shipment details by email with a link to add their cost.
 * "Review email" then shows the email (the company's template) to preview, edit for this send only, or reset. Agents that handle the enquiry's mode in the country it ships from (e.g. sea agents in China for Ningbo) start out selected; anyone else can be
 * searched and added. A Radix dialog (not Modal) because it opens over the enquiry detail sheet, which blocks anything
 * outside Radix layers.
 */
export function SendToAgentDialog({ enquiry, open, onClose, onSent }: { enquiry: EnquiryListItem; open: boolean; onClose: () => void; onSent: () => void }) {
  const [agents, setAgents] = useState<Agent[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Sent[] | null>(null);
  const [step, setStep] = useState<"pick" | "review">("pick");
  const [saved, setSaved] = useState<EmailTemplate | null>(null);
  const [draft, setDraft] = useState<EmailTemplate | null>(null);
  const [mailContext, setMailContext] = useState<MailContext | null>(null);
  const [loadingMail, setLoadingMail] = useState(false);
  const emailState = useEmailJobs((results ?? []).map((r) => r.email_job_id));

  const places = useLocations();
  const suggested = useMemo(() => (places ? (agents ?? []).filter((a) => agentMatchesRoute(a, enquiry, places)) : []), [agents, enquiry, places]);

  useEffect(() => {
    if (!open || agents) return;
    fetch("/api/agents")
      .then((res) => (res.ok ? res.json() : { agents: [] }))
      .then((data) => setAgents(data.agents ?? []))
      .catch(() => setAgents([]));
  }, [open, agents]);

  // The first time the list is there, start with the agents that fit the mode and route.
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (agents && places && !seeded) {
      setSelected(new Set(suggested.map((a) => a.id)));
      setSeeded(true);
    }
  }, [agents, places, suggested, seeded]);

  const alreadyAsked = new Set(enquiry.agent_requests.map((r) => r.agent));
  const suggestedIds = new Set(suggested.map((a) => a.id));
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (a: Agent) => tokens.every((t) => [a.name, a.country, a.network, a.code, a.contact_person, ...a.modes].some((v) => v?.toLowerCase().includes(t)));
  // With nothing typed: the suggestions first, then everyone else. Typing searches all agents.
  const visible = (agents ?? []).filter(matches);
  const shownSuggested = visible.filter((a) => suggestedIds.has(a.id));
  const shownOthers = visible.filter((a) => !suggestedIds.has(a.id));

  const toggle = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  const chosen = (agents ?? []).filter((a) => selected.has(a.id));

  function close() {
    const sent = !!results;
    onClose();
    if (sent) onSent();
    setSelected(new Set());
    setSeeded(false);
    setQuery("");
    setError(null);
    setResults(null);
    setStep("pick");
    setSaved(null);
    setDraft(null);
  }

  async function review() {
    setError(null);
    setStep("review");
    if (saved) return;
    setLoadingMail(true);
    try {
      const res = await fetch(`/api/email-templates?org_id=${enquiry.company.id}&key=agent_rate_request&enquiry_id=${enquiry.id}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.template) throw new Error(data.error || "Couldn't load the email");
      setSaved({ subject: data.template.subject, body: data.template.body });
      setDraft({ subject: data.template.subject, body: data.template.body });
      setMailContext(data.context);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load the email");
      setStep("pick");
    } finally {
      setLoadingMail(false);
    }
  }

  // Preview with the first selected agent; every agent's own name and link are filled in when sent.
  const mailVars: EmailVars = {
    contact_name: chosen[0]?.contact_person,
    company: mailContext?.company ?? "",
    ref: mailContext?.ref ?? enquiry.ref,
    sender: mailContext?.sender ?? "",
    link: `${typeof window === "undefined" ? "" : window.location.origin}/agent-quote/…`,
    valid_days: mailContext?.valid_days ?? 30,
    logo_src: mailContext?.logo_src,
    shipment: mailContext?.shipment ?? [],
  };
  const edited = !!saved && !!draft && (draft.subject !== saved.subject || draft.body !== saved.body);
  const mailProblem = draft ? templateProblem(draft) : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step !== "review") return selected.size > 0 ? review() : undefined; // Enter in the search box must not skip the review
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/enquiries/${enquiry.id}/send-to-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_ids: [...selected], ...(edited ? draft : {}) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.results) throw new Error(data.error || `Couldn't send to the agents (server error ${res.status}). Please try again.`);
      setResults(data.results); // refresh the list on close: the enquiry leaves this tab now, which would unmount this dialog
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send to the agents");
    } finally {
      setSaving(false);
    }
  }

  const row = (a: Agent) => {
    const on = selected.has(a.id);
    return (
      <li key={a.id}>
        <label className={cn("flex cursor-pointer items-start gap-3 rounded-control px-3 py-2 transition-colors hover:bg-muted has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring", on && "bg-primary-soft/50")}>
          <input type="checkbox" checked={on} onChange={() => toggle(a.id)} className="mt-1 size-4 cursor-pointer accent-[var(--primary)]" />
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-medium text-foreground">
              {a.name}
              {a.is_top && (
                <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-1.5 py-px text-[10px] font-semibold text-warning-foreground">
                  <Star size={10} className="fill-current" aria-hidden /> Top
                </span>
              )}
              {alreadyAsked.has(a.name) && <span className="rounded-full bg-muted px-1.5 py-px text-[10px] font-medium text-muted-foreground">already asked</span>}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {[a.country, a.network, a.modes.map(titleCase).join(", ")].filter(Boolean).join(" · ") || a.email}
            </span>
          </span>
        </label>
      </li>
    );
  };

  const route = `${titleCase(enquiry.mode)} · ${enquiry.from} → ${enquiry.to}`;
  const states = (results ?? []).map((r) => emailState(r.email_job_id));
  const emailedCount = states.filter((s) => s === "sent").length;
  const waiting = states.filter((s) => s === "queued").length;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      {open && (
        <DialogContent
          title={results ? `Sent to ${results.length} agent${results.length === 1 ? "" : "s"}` : `Send ${enquiry.ref} to agents`}
          description={
            results
              ? `${enquiry.ref} is now "With agent". Each agent's cost shows on the enquiry when they reply.`
              : step === "review"
                ? `Review the email each of the ${selected.size} agent${selected.size === 1 ? "" : "s"} will get. Changes here apply to this send only.`
                : "Agents get the shipment details (not the client's name) by email, with a link to add their cost."
          }
        >
          {results ? (
            <>
              <DialogBody className="space-y-3">
                <p className={cn("flex items-start gap-2 rounded-control px-3 py-2.5 text-sm", waiting ? "bg-muted text-foreground" : emailedCount === results.length ? "bg-success-soft text-success-foreground" : "bg-warning-soft text-warning-foreground")} aria-live="polite">
                  {waiting ? <Loader2 size={16} className="mt-0.5 shrink-0 animate-spin" aria-hidden /> : emailedCount === results.length ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden /> : <MailWarning size={16} className="mt-0.5 shrink-0" aria-hidden />}
                  {waiting
                    ? `Sending ${waiting} of ${results.length} email${results.length === 1 ? "" : "s"} in the background. You can close this.`
                    : emailedCount === results.length
                      ? `Emailed to all ${results.length}.`
                      : `${emailedCount} of ${results.length} emailed. For the others, copy the link and send it to the agent yourself.`}
                </p>
                <ul className="divide-y divide-border rounded-control border border-border">
                  {results.map((r, i) => {
                    const state = states[i];
                    return (
                      <li key={r.url} className="space-y-1.5 p-3">
                        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                          {state === "queued" ? <Loader2 size={14} className="animate-spin text-muted-foreground" aria-label="Sending" /> : state === "sent" ? <CheckCircle2 size={14} className="text-success" aria-label="Emailed" /> : <MailWarning size={14} className="text-warning" aria-label="Not emailed" />}
                          {r.agent}
                          <span className="font-normal text-muted-foreground">{r.email}</span>
                        </p>
                        {(state === "failed" || state === "not_configured") && (
                          <>
                            <p className="text-xs text-warning-foreground">{state === "failed" ? "The email couldn't be sent." : "Email isn't set up, so nothing was sent."} Share this link instead:</p>
                            <div className="flex items-center gap-2">
                              <input readOnly value={r.url} aria-label={`${r.agent} link`} onFocus={(e) => e.target.select()} className="h-8 min-w-0 flex-1 rounded-control border border-input bg-subtle px-3 text-xs text-foreground" />
                              <CopyLinkButton url={r.url} />
                            </div>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </DialogBody>
              <DialogFooter>
                <Button type="button" onClick={close}>
                  Done
                </Button>
              </DialogFooter>
            </>
          ) : (
            <form onSubmit={submit}>
              <DialogBody className={cn("space-y-3", step === "review" && "hidden")}>
                {error && (
                  <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm font-medium text-danger-foreground">
                    {error}
                  </p>
                )}
                {agents && agents.length === 0 ? (
                  <p className="rounded-control border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                    No unlocked agents. A manager can add or unlock them on the Agents page.
                  </p>
                ) : (
                  <>
                    <div className="relative">
                      <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
                      <input
                        type="search"
                        aria-label="Search agents"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={!agents}
                        placeholder={agents ? "Search agents by name, country, network or mode…" : "Loading agents…"}
                        className="h-10 w-full rounded-control border border-input bg-card pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/15"
                      />
                    </div>

                    {chosen.length > 0 && (
                      <ul className="flex flex-wrap gap-1.5" aria-label="Selected agents">
                        {chosen.map((a) => (
                          <li key={a.id} className="inline-flex items-center gap-1 rounded-full bg-primary-soft py-0.5 pl-2.5 pr-1 text-xs font-medium text-primary-soft-foreground">
                            {a.is_top && <Star size={11} className="fill-current" aria-hidden />}
                            {a.name}
                            <button type="button" aria-label={`Remove ${a.name}`} onClick={() => toggle(a.id)} className="cursor-pointer rounded-full p-0.5 hover:bg-primary/10">
                              <X size={12} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="max-h-72 overflow-y-auto rounded-control border border-border p-1">
                      {agents && visible.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">No agents match “{query}”.</p>}
                      {shownSuggested.length > 0 && (
                        <section aria-label="Suggested agents">
                          <h4 className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Suggested for {route}</h4>
                          <ul>{shownSuggested.map(row)}</ul>
                        </section>
                      )}
                      {agents && !query && suggested.length === 0 && (
                        <p className="px-3 py-2 text-xs text-muted-foreground">No agent is set up for {route}. Pick from the list below or search.</p>
                      )}
                      {shownOthers.length > 0 && (
                        <section aria-label="Other agents">
                          <h4 className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{shownSuggested.length ? "Other agents" : "Agents"}</h4>
                          <ul>{shownOthers.map(row)}</ul>
                        </section>
                      )}
                    </div>
                  </>
                )}
              </DialogBody>
              {step === "review" && (
                <DialogBody className="space-y-3">
                  {error && (
                    <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm font-medium text-danger-foreground">
                      {error}
                    </p>
                  )}
                  {loadingMail || !draft ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">Loading the email…</p>
                  ) : (
                    <>
                      <EmailTemplateEditor templateKey="agent_rate_request" subject={draft.subject} body={draft.body} onChange={setDraft} vars={mailVars} />
                      <p className="text-xs text-muted-foreground">Each agent's name and their own link are filled in when it is sent. The preview shows {chosen[0]?.name ?? "the first agent"}.</p>
                      {mailProblem && edited && (
                        <p role="alert" className="text-sm font-medium text-danger-foreground">
                          {mailProblem}
                        </p>
                      )}
                    </>
                  )}
                </DialogBody>
              )}
              <DialogFooter>
                {step === "pick" ? (
                  <>
                    <Button type="button" variant="secondary" onClick={close}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={review} disabled={selected.size === 0}>
                      Review email
                    </Button>
                  </>
                ) : (
                  <>
                    <Button type="button" variant="secondary" onClick={() => setStep("pick")}>
                      <ArrowLeft /> Agents
                    </Button>
                    {edited && (
                      <Button type="button" variant="secondary" onClick={() => setDraft(saved)}>
                        <RotateCcw /> Reset to default
                      </Button>
                    )}
                    <Button type="submit" loading={saving} disabled={!draft || !!mailProblem}>
                      <Send /> {selected.size > 1 ? `Send to ${selected.size} agents` : "Send to agent"}
                    </Button>
                  </>
                )}
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
