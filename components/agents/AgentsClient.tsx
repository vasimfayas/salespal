"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Globe, Lock, LockOpen, Mail, Pencil, Phone, Plus, Trash2, Upload, UserRound, Users, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { labelClass } from "@/components/ui/field-styles";
import { AGENT_COLUMNS, BulkImportAgentsModal } from "@/components/agents/BulkImportAgentsModal";
import { downloadCsv } from "@/lib/csv";
import { FREIGHT_LOCATIONS } from "@/lib/locations";
import { cn, titleCase } from "@/lib/utils";
import { orderModes } from "@/types/order";

export type AgentRow = {
  id: number;
  name: string;
  contact_person: string | null;
  email: string;
  extra_emails: string[];
  phone: string | null;
  extra_phones: string[];
  country: string | null;
  network: string | null;
  code: string | null;
  modes: string[];
  locked: boolean;
  requests: number;
};

const EMPTY = { name: "", contact_person: "", emails: [""], phones: [""], country: "", network: "", code: "", modes: [] as string[] };
const toBody = (f: typeof EMPTY) => ({
  ...f,
  email: f.emails[0]?.trim() ?? "",
  extra_emails: f.emails.slice(1),
  phone: f.phones[0] ?? "",
  extra_phones: f.phones.slice(1),
});

/** One input per value, with add / remove; the first value is the primary one. */
function MultiInput({ label, type, values, onChange, hint, required }: { label: string; type: "email" | "tel"; values: string[]; onChange: (v: string[]) => void; hint?: string; required?: boolean }) {
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex items-end gap-2">
          <div className="flex-1">
            <Input label={i === 0 ? label : `${label} ${i + 1}`} type={type} required={required && i === 0} value={v} hint={i === 0 ? hint : undefined} onChange={(e) => onChange(values.map((x, j) => (j === i ? e.target.value : x)))} />
          </div>
          {values.length > 1 && (
            <Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove ${label.toLowerCase()} ${i + 1}`} onClick={() => onChange(values.filter((_, j) => j !== i))}>
              <X />
            </Button>
          )}
        </div>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={() => onChange([...values, ""])}>
        <Plus /> Add another
      </Button>
    </div>
  );
}
const COUNTRIES = [...new Set(FREIGHT_LOCATIONS.map((l) => l.country))].sort();

/**
 * The agents directory: add, edit and delete the agents enquiries are sent to for rates, and lock / unlock them.
 * `canEdit` off (accounts) leaves only the lock toggle.
 */
export function AgentsClient({ agents, canEdit = true }: { agents: AgentRow[]; canEdit?: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AgentRow | "new" | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [importing, setImporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function open(agent: AgentRow | "new") {
    setEditing(agent);
    setError(null);
    setForm(
      agent === "new"
        ? EMPTY
        : {
            name: agent.name,
            contact_person: agent.contact_person ?? "",
            emails: [agent.email, ...agent.extra_emails],
            phones: [agent.phone ?? "", ...agent.extra_phones],
            country: agent.country ?? "",
            network: agent.network ?? "",
            code: agent.code ?? "",
            modes: agent.modes,
          },
    );
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(editing === "new" ? "/api/agents" : `/api/agents/${(editing as AgentRow).id}`, {
        method: editing === "new" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toBody(form)),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't save the agent");
      toast.success(editing === "new" ? "Agent added" : "Agent updated");
      setEditing(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save the agent");
    } finally {
      setSaving(false);
    }
  }

  function exportAgents() {
    downloadCsv("agents.csv", [
      [...AGENT_COLUMNS],
      ...agents.map((a) => [a.name, a.contact_person ?? "", [a.email, ...a.extra_emails].join("; "), [a.phone ?? "", ...a.extra_phones].filter(Boolean).join("; "), a.country ?? "", a.network ?? "", a.code ?? "", a.modes.join("; ")]),
    ]);
  }

  async function toggleLock(agent: AgentRow) {
    const res = await fetch(`/api/agents/${agent.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locked: !agent.locked }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(data.error || "Couldn't update the agent");
    toast.success(agent.locked ? `${agent.name} unlocked` : `${agent.name} locked`);
    router.refresh();
  }

  async function remove(agent: AgentRow) {
    if (!confirm(`Delete ${agent.name}?`)) return;
    const res = await fetch(`/api/agents/${agent.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(data.error || "Couldn't delete the agent");
    toast.success("Agent deleted");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        {agents.length > 0 && (
          <Button size="sm" variant="secondary" onClick={exportAgents}>
            <Download /> Export
          </Button>
        )}
        {canEdit && (
          <>
            <Button size="sm" variant="secondary" onClick={() => setImporting(true)}>
              <Upload /> Import
            </Button>
            <Button size="sm" onClick={() => open("new")}>
              <Plus /> Add agent
            </Button>
          </>
        )}
      </div>
      <BulkImportAgentsModal open={importing} onClose={() => setImporting(false)} onImported={() => router.refresh()} />

      {agents.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No agents yet"
          message={canEdit ? "Add the agents you ask for rates. Enquiries can then be sent to them by email." : "Managers add the agents enquiries are sent to."}
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {agents.map((a) => (
            <li key={a.id} className={cn("flex flex-col gap-3 rounded-card border border-border bg-card p-4 shadow-card", a.locked && "bg-muted/40")}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="flex items-center gap-2 font-semibold text-foreground">
                    <span className="truncate">{a.name}</span>
                    {a.locked && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-danger-soft px-2 py-0.5 text-[11px] font-semibold text-danger-foreground">
                        <Lock size={11} aria-hidden /> Locked
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {a.requests ? `${a.requests} rate request${a.requests === 1 ? "" : "s"}` : "No rate requests yet"}
                  </p>
                </div>
                <div className="flex shrink-0">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => toggleLock(a)}
                    aria-label={`${a.locked ? "Unlock" : "Lock"} ${a.name}`}
                    title={a.locked ? "Unlock: enquiries can be sent to this agent" : "Lock: hide this agent when sending enquiries"}
                  >
                    {a.locked ? <LockOpen /> : <Lock />}
                  </Button>
                  {canEdit && (
                    <Button variant="ghost" size="icon-sm" onClick={() => open(a)} aria-label={`Edit ${a.name}`} title="Edit">
                      <Pencil />
                    </Button>
                  )}
                  {canEdit && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remove(a)}
                    aria-label={`Delete ${a.name}`}
                    title={a.requests ? "Agents with rate requests can't be deleted" : "Delete"}
                    disabled={a.requests > 0}
                    className="hover:bg-danger-soft hover:text-danger-foreground"
                  >
                    <Trash2 />
                  </Button>
                  )}
                </div>
              </div>
              {(a.country || a.network || a.code || a.modes.length > 0) && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {a.country && (
                    <span className="inline-flex items-center gap-1 text-foreground">
                      <Globe size={13} className="text-muted-foreground" aria-label="Country" /> {a.country}
                    </span>
                  )}
                  {(a.network || a.code) && (
                    <span className="rounded-full bg-primary-soft px-2 py-0.5 font-medium text-primary-soft-foreground">
                      {[a.network, a.code].filter(Boolean).join(" · ")}
                    </span>
                  )}
                  {a.modes.map((m) => (
                    <span key={m} className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                      {titleCase(m)}
                    </span>
                  ))}
                </div>
              )}
              <dl className="space-y-1 text-sm">
                {a.contact_person && (
                  <div className="flex items-center gap-2 text-foreground">
                    <UserRound size={14} className="shrink-0 text-muted-foreground" aria-label="Contact person" /> {a.contact_person}
                  </div>
                )}
                {[a.email, ...a.extra_emails].map((email) => (
                  <a key={email} href={`mailto:${email}`} className="flex min-w-0 items-center gap-2 text-foreground hover:text-primary">
                    <Mail size={14} className="shrink-0 text-muted-foreground" aria-label="Email" /> <span className="truncate">{email}</span>
                  </a>
                ))}
                {[a.phone, ...a.extra_phones].filter((p): p is string => Boolean(p)).map((phone) => (
                  <a key={phone} href={`tel:${phone}`} className="flex items-center gap-2 text-foreground hover:text-primary">
                    <Phone size={14} className="shrink-0 text-muted-foreground" aria-label="Phone" /> {phone}
                  </a>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)}>
        <form onSubmit={save} className="space-y-4">
          <ModalHeader title={editing === "new" ? "Add agent" : "Edit agent"} onClose={() => setEditing(null)} />
          {error && (
            <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm font-medium text-danger-foreground">
              {error}
            </p>
          )}
          <fieldset>
            <legend className={labelClass}>Modes</legend>
            <div className="flex flex-wrap gap-2">
              {orderModes.map((m) => {
                const on = form.modes.includes(m);
                return (
                  <label
                    key={m}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-2 rounded-control border px-3 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                      on ? "border-primary bg-primary-soft text-primary-soft-foreground" : "border-border text-foreground hover:bg-muted",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      onChange={() => setForm({ ...form, modes: on ? form.modes.filter((x) => x !== m) : [...form.modes, m] })}
                    />
                    {titleCase(m)}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Network (optional)" value={form.network} onChange={(e) => setForm({ ...form, network: e.target.value })} placeholder="e.g. WCA" />
            <Input label="Code (optional)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
          <Input label="Agent name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Gulf Freight Partners" />
          <Input label="Contact person (optional)" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
          <MultiInput label="Email" type="email" required values={form.emails} onChange={(emails) => setForm({ ...form, emails })} hint="Rate requests are sent to all emails." />
          <MultiInput label="Phone (optional)" type="tel" values={form.phones} onChange={(phones) => setForm({ ...form, phones })} />
          <Input
            label="Country (optional)"
            list="agent-countries"
            autoComplete="off"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            placeholder="e.g. India"
          />
          <datalist id="agent-countries">
            {COUNTRIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <ModalFooter>
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing === "new" ? "Add agent" : "Save"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
