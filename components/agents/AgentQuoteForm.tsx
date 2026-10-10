"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

/** The agent's reply on their emailed link: their cost and any terms. */
export function AgentQuoteForm({ token, companyName }: { token: string; companyName: string }) {
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/agent-quote/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cost: Number(cost), notes }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't send your cost. Please try again.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send your cost. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="animate-page-in rounded-card border border-border bg-card p-8 text-center shadow-card">
        <CheckCircle2 className="mx-auto size-10 text-success-foreground" aria-hidden />
        <h2 className="mt-3 text-lg font-semibold text-foreground">Thank you, your cost was sent</h2>
        <p className="mt-1 text-sm text-muted-foreground">{companyName} will be in touch if the shipment goes ahead.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-card border border-border bg-card p-5 shadow-card sm:p-6">
      <h2 className="text-base font-semibold text-foreground">Your rate</h2>
      {error && (
        <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm font-medium text-danger-foreground">
          {error}
        </p>
      )}
      <div className="sm:max-w-xs">
        <Input label="Total cost" type="number" min="0.01" step="0.01" inputMode="decimal" required value={cost} onChange={(e) => setCost(e.target.value)} />
      </div>
      <Textarea
        id="agent-notes"
        label="Notes (optional)"
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Currency, validity, transit time, what's included or excluded…"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="animate-spin" />} Send my cost
        </Button>
      </div>
    </form>
  );
}
