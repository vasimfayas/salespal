"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Pencil, Phone, Plus, Trash2, UserRound, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui/Modal";

export type AgentRow = { id: number; name: string; contact_person: string | null; email: string; phone: string | null; requests: number };

const EMPTY = { name: "", contact_person: "", email: "", phone: "" };

/** The agents directory: add, edit and delete the agents enquiries are sent to for rates. */
export function AgentsClient({ agents }: { agents: AgentRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AgentRow | "new" | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function open(agent: AgentRow | "new") {
    setEditing(agent);
    setError(null);
    setForm(agent === "new" ? EMPTY : { name: agent.name, contact_person: agent.contact_person ?? "", email: agent.email, phone: agent.phone ?? "" });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(editing === "new" ? "/api/agents" : `/api/agents/${(editing as AgentRow).id}`, {
        method: editing === "new" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      <div className="flex justify-end">
        <Button size="sm" onClick={() => open("new")}>
          <Plus /> Add agent
        </Button>
      </div>

      {agents.length === 0 ? (
        <EmptyState icon={Users} title="No agents yet" message="Add the agents you ask for rates. Enquiries can then be sent to them by email." />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {agents.map((a) => (
            <li key={a.id} className="flex flex-col gap-3 rounded-card border border-border bg-card p-4 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-foreground">{a.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {a.requests ? `${a.requests} rate request${a.requests === 1 ? "" : "s"}` : "No rate requests yet"}
                  </p>
                </div>
                <div className="flex shrink-0">
                  <Button variant="ghost" size="icon-sm" onClick={() => open(a)} aria-label={`Edit ${a.name}`} title="Edit">
                    <Pencil />
                  </Button>
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
                </div>
              </div>
              <dl className="space-y-1 text-sm">
                {a.contact_person && (
                  <div className="flex items-center gap-2 text-foreground">
                    <UserRound size={14} className="shrink-0 text-muted-foreground" aria-label="Contact person" /> {a.contact_person}
                  </div>
                )}
                <a href={`mailto:${a.email}`} className="flex min-w-0 items-center gap-2 text-foreground hover:text-primary">
                  <Mail size={14} className="shrink-0 text-muted-foreground" aria-label="Email" /> <span className="truncate">{a.email}</span>
                </a>
                {a.phone && (
                  <a href={`tel:${a.phone}`} className="flex items-center gap-2 text-foreground hover:text-primary">
                    <Phone size={14} className="shrink-0 text-muted-foreground" aria-label="Phone" /> {a.phone}
                  </a>
                )}
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
          <Input label="Agent name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Gulf Freight Partners" />
          <Input label="Contact person (optional)" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} hint="Rate requests are sent here." />
          <Input label="Phone (optional)" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
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
