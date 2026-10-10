"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MailWarning, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Select } from "@/components/ui/Select";
import { CopyLinkButton } from "@/components/enquiries/SendToClientDialog";
import type { EnquiryListItem } from "@/types/enquiry";

type Agent = { id: number; name: string; contact_person: string | null; email: string };
type Result = { agent: string; email: string; url: string; emailed: boolean; emailError: string | null };

/**
 * "Send to agent": pick an agent; they get the shipment details by email with a link to add their cost.
 * A Radix dialog (not Modal) because it opens over the enquiry detail sheet, which blocks anything outside Radix layers.
 */
export function SendToAgentDialog({ enquiry, open, onClose, onSent }: { enquiry: EnquiryListItem; open: boolean; onClose: () => void; onSent: () => void }) {
  const [agents, setAgents] = useState<Agent[] | null>(null);
  const [agentId, setAgentId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!open || agents) return;
    fetch("/api/agents")
      .then((res) => (res.ok ? res.json() : { agents: [] }))
      .then((data) => setAgents(data.agents ?? []))
      .catch(() => setAgents([]));
  }, [open, agents]);

  const alreadyAsked = new Set(enquiry.agent_requests.map((r) => r.agent));
  const agent = agents?.find((a) => String(a.id) === agentId);

  function close() {
    onClose();
    setAgentId("");
    setError(null);
    setResult(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/enquiries/${enquiry.id}/send-to-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: Number(agentId) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || `Couldn't send to the agent (server error ${res.status}). Please try again.`);
      setResult({ agent: data.agent, email: data.email, url: data.url, emailed: data.emailed, emailError: data.email_error });
      onSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send to the agent");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      {open && (
        <DialogContent
          title={result ? `Sent to ${result.agent}` : `Send ${enquiry.ref} to an agent`}
          description={
            result
              ? `${enquiry.ref} is now "With agent". Their cost shows on the enquiry when they reply.`
              : "The agent gets the shipment details (not the client's name) by email, with a link to add their cost."
          }
        >
          {result ? (
            <>
              <DialogBody className="space-y-4">
                {result.emailed ? (
                  <p className="flex items-start gap-2 rounded-control bg-success-soft px-3 py-2.5 text-sm text-success-foreground">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden /> Emailed to {result.email}.
                  </p>
                ) : (
                  <p className="flex items-start gap-2 rounded-control bg-warning-soft px-3 py-2.5 text-sm text-warning-foreground">
                    <MailWarning size={16} className="mt-0.5 shrink-0" aria-hidden />
                    {result.emailError ?? "Email isn't set up yet, so nothing was sent."} Copy the link and send it to the agent yourself.
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <input readOnly value={result.url} aria-label="Agent link" onFocus={(e) => e.target.select()} className="h-9 min-w-0 flex-1 rounded-control border border-input bg-subtle px-3 text-xs text-foreground" />
                  <CopyLinkButton url={result.url} />
                </div>
              </DialogBody>
              <DialogFooter>
                <Button type="button" onClick={close}>
                  Done
                </Button>
              </DialogFooter>
            </>
          ) : (
            <form onSubmit={submit}>
              <DialogBody className="space-y-4">
                {error && (
                  <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm font-medium text-danger-foreground">
                    {error}
                  </p>
                )}
                {agents && agents.length === 0 ? (
                  <p className="rounded-control border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                    No agents yet. A manager can add them on the Agents page.
                  </p>
                ) : (
                  <Select id="send-agent" label="Agent" required disabled={!agents} value={agentId} onChange={(e) => setAgentId(e.target.value)}>
                    <option value="">{agents ? "Select an agent…" : "Loading agents…"}</option>
                    {agents?.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                        {alreadyAsked.has(a.name) ? " (already asked)" : ""}
                      </option>
                    ))}
                  </Select>
                )}
                {agent && (
                  <p className="text-sm text-muted-foreground">
                    Goes to <span className="font-medium text-foreground">{agent.email}</span>
                    {agent.contact_person ? ` · ${agent.contact_person}` : ""}
                  </p>
                )}
              </DialogBody>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit" loading={saving} disabled={!agentId}>
                  <Send /> Send to agent
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
