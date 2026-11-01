"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DialogBody, DialogFooter } from "@/components/ui/dialog";
import { controlBase, controlHeight, labelClass } from "@/components/ui/field-styles";
import { QuoteLinesField, quoteLinesPayload } from "@/components/enquiries/QuoteLinesField";
import { emptyQuoteLine, filledQuoteLines, quoteTotals, type QuoteLine, type QuoteLineInput } from "@/lib/quote-lines";
import { cn, formatAmount } from "@/lib/utils";
import type { EnquiryListItem } from "@/types/enquiry";

type Option = EnquiryListItem["quote_options"][number];
type Draft = { id: number | null; agentId: string; lines: QuoteLineInput[] };

const sameLines = (a: QuoteLine[], b: QuoteLine[]) =>
  a.length === b.length && a.every((l, i) => l.label === b[i].label && l.cost === b[i].cost && l.selling === b[i].selling);

async function send(url: string, method: string, body?: unknown) {
  const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

/**
 * Quote / requote dialog body: save one quote per agent (agent + charge lines), then pick the one to use.
 * Using one copies its lines into the enquiry's quote via the stage action (option_id).
 */
export function AgentQuotes({
  enquiry,
  mode,
  onClose,
  onSaved,
  onChanged,
}: {
  enquiry: EnquiryListItem;
  mode: "quote" | "requote";
  onClose: () => void;
  /** The enquiry was (re)quoted with a chosen option. */
  onSaved: (msg: string) => void;
  /** An option was added / changed / removed (refresh the list behind the dialog). */
  onChanged: () => void;
}) {
  const [options, setOptions] = useState<Option[]>(enquiry.quote_options);
  const [agents, setAgents] = useState<{ id: number; name: string }[] | null>(null);
  const [draft, setDraft] = useState<Draft | null>(() => (enquiry.quote_options.length ? null : { id: null, agentId: "", lines: [emptyQuoteLine()] }));
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/agents")
      .then((res) => (res.ok ? res.json() : { agents: [] }))
      .then((data) => live && setAgents((data.agents ?? []).map((a: { id: number; name: string }) => ({ id: a.id, name: a.name }))))
      .catch(() => live && setAgents([]));
    return () => {
      live = false;
    };
  }, []);

  // An agent who replied to the rate request: their rate starts the first line's cost.
  const replyCost = (agentId: string) => enquiry.agent_requests.find((r) => String(r.agent_id) === agentId && r.cost !== null)?.cost ?? null;
  const pickAgent = (agentId: string) =>
    setDraft((d) => {
      if (!d) return d;
      const cost = replyCost(agentId);
      const untouched = d.lines.length === 1 && !d.lines[0].label && d.lines[0].cost === "" && d.lines[0].selling === "";
      return { ...d, agentId, lines: untouched && cost !== null ? [{ label: "Freight", cost: String(cost), selling: "" }] : d.lines };
    });

  async function saveDraft(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setBusy("save");
    setError(null);
    try {
      const body = { agent_id: Number(draft.agentId), lines: quoteLinesPayload(draft.lines) };
      const base = `/api/enquiries/${enquiry.id}/quote-options`;
      const res = draft.id ? await send(`${base}/${draft.id}`, "PATCH", body) : await send(base, "POST", body);
      const lines = body.lines;
      const { cost, selling } = quoteTotals(lines);
      const saved: Option = {
        id: draft.id ?? res.option.id,
        agent_id: body.agent_id,
        agent: agents?.find((a) => a.id === body.agent_id)?.name ?? options.find((o) => o.id === draft.id)?.agent ?? "Agent",
        lines,
        cost,
        selling,
        updated_at: new Date().toISOString(),
      };
      setOptions((os) => (draft.id ? os.map((o) => (o.id === draft.id ? saved : o)) : [...os, saved]));
      setDraft(null);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save the quote");
    } finally {
      setBusy(null);
    }
  }

  async function remove(o: Option) {
    if (!confirm(`Delete ${o.agent}'s quote?`)) return;
    setBusy(`del-${o.id}`);
    setError(null);
    try {
      await send(`/api/enquiries/${enquiry.id}/quote-options/${o.id}`, "DELETE");
      setOptions((os) => os.filter((x) => x.id !== o.id));
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete the quote");
    } finally {
      setBusy(null);
    }
  }

  async function use(o: Option) {
    setBusy(`use-${o.id}`);
    setError(null);
    try {
      await send(`/api/enquiries/${enquiry.id}/stage`, "POST", { action: mode, option_id: o.id });
      onSaved(`${enquiry.ref} ${mode === "quote" ? "quoted" : "requoted"} with ${o.agent}'s rates`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't use this quote");
      setBusy(null);
    }
  }

  const inUse = (o: Option) => enquiry.selected_quote_option_id === o.id && sameLines(o.lines, enquiry.quote_lines);
  const draftTotals = draft ? filledQuoteLines(draft.lines).length > 0 : false;

  if (draft) {
    return (
      <form onSubmit={saveDraft}>
        <DialogBody className="space-y-4">
          {error && <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm text-danger-foreground">{error}</p>}
          <label className="block">
            <span className={labelClass}>Agent</span>
            <select required autoFocus value={draft.agentId} onChange={(e) => pickAgent(e.target.value)} className={cn(controlBase, controlHeight, "cursor-pointer")}>
              <option value="">{agents === null ? "Loading agents…" : "Select the agent…"}</option>
              {draft.agentId && agents && !agents.some((a) => String(a.id) === draft.agentId) && (
                <option value={draft.agentId}>{options.find((o) => o.id === draft.id)?.agent ?? "Previous agent"}</option>
              )}
              {(agents ?? []).map((a) => {
                const cost = replyCost(String(a.id));
                return (
                  <option key={a.id} value={a.id}>
                    {a.name}
                    {cost !== null ? ` · replied ${formatAmount(cost)}` : ""}
                  </option>
                );
              })}
            </select>
          </label>
          <QuoteLinesField lines={draft.lines} onChange={(lines) => setDraft({ ...draft, lines })} required />
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => (options.length ? setDraft(null) : onClose())} disabled={busy === "save"}>
            {options.length ? "Back to quotes" : "Cancel"}
          </Button>
          <Button type="submit" loading={busy === "save"} disabled={!draft.agentId || !draftTotals}>
            Save agent quote
          </Button>
        </DialogFooter>
      </form>
    );
  }

  return (
    <>
      <DialogBody className="space-y-3">
        {error && <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm text-danger-foreground">{error}</p>}
        <p className="text-sm text-muted-foreground">Save each agent&apos;s rates, then choose the quote to use for this enquiry.</p>
        {options.map((o) => {
          const used = inUse(o);
          return (
            <section key={o.id} className={cn("rounded-control border p-3", used ? "border-primary bg-primary-soft/30" : "border-border")}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {o.agent}
                  {used && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                      <CheckCircle2 className="size-3" /> In use
                    </span>
                  )}
                </h4>
                <span className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${o.agent}'s quote`}
                    title="Edit"
                    onClick={() => setDraft({ id: o.id, agentId: o.agent_id ? String(o.agent_id) : "", lines: o.lines.map((l) => ({ label: l.label, cost: String(l.cost), selling: String(l.selling) })) })}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${o.agent}'s quote`}
                    title={used ? "In use: choose another quote first" : "Delete"}
                    disabled={enquiry.selected_quote_option_id === o.id}
                    loading={busy === `del-${o.id}`}
                    onClick={() => remove(o)}
                    className="hover:bg-danger-soft hover:text-danger-foreground"
                  >
                    <Trash2 />
                  </Button>
                </span>
              </div>
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="pb-1 text-left font-medium">Charge</th>
                    <th scope="col" className="pb-1 text-right font-medium">Cost</th>
                    <th scope="col" className="pb-1 text-right font-medium">Selling</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {o.lines.map((l, i) => (
                    <tr key={i}>
                      <td className="py-0.5 text-foreground">{l.label}</td>
                      <td className="py-0.5 text-right text-foreground">{formatAmount(l.cost)}</td>
                      <td className="py-0.5 text-right text-foreground">{formatAmount(l.selling)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2 text-sm">
                <span className="tabular-nums text-muted-foreground">
                  Cost {formatAmount(o.cost)} · Selling <span className="font-semibold text-foreground">{formatAmount(o.selling)}</span> · Profit{" "}
                  <span className={cn("font-semibold", o.selling - o.cost < 0 ? "text-danger-foreground" : "text-success-foreground")}>
                    {formatAmount(o.selling - o.cost)}
                  </span>
                </span>
                {!used && (
                  <Button type="button" size="sm" loading={busy === `use-${o.id}`} disabled={busy !== null} onClick={() => use(o)}>
                    Use this quote
                  </Button>
                )}
              </div>
            </section>
          );
        })}
        <Button type="button" variant="secondary" size="sm" onClick={() => setDraft({ id: null, agentId: "", lines: [emptyQuoteLine()] })}>
          <Plus /> Add agent quote
        </Button>
      </DialogBody>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </>
  );
}
