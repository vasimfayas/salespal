"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Pencil, Phone, Plus, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { formatPhoneNumber } from "@/lib/utils";
import type { ClientContactItem } from "@/lib/client-contacts";

type Main = { name: string | null; designation: string | null; phone: string | null; email: string | null };

const EMPTY = { name: "", designation: "", phone: "", email: "" };
const blank = (v: string | null) => !v || v === "-";

/** The client's contact people: the main contact (edited with the client) and any extra contacts added here. */
export function ClientContactsCard({ clientId, main, contacts }: { clientId: number; main: Main; contacts: ClientContactItem[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<ClientContactItem | "new" | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function open(contact: ClientContactItem | "new") {
    setEditing(contact);
    setError(null);
    setForm(contact === "new" ? EMPTY : { name: contact.name, designation: contact.designation ?? "", phone: contact.phone ?? "", email: contact.email ?? "" });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(editing === "new" ? `/api/clients/${clientId}/contacts` : `/api/clients/${clientId}/contacts/${(editing as ClientContactItem).id}`, {
        method: editing === "new" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't save the contact");
      toast.success(editing === "new" ? "Contact added" : "Contact updated");
      setEditing(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save the contact");
    } finally {
      setSaving(false);
    }
  }

  async function remove(contact: ClientContactItem) {
    if (!confirm(`Remove ${contact.name} from this client's contacts?`)) return;
    const res = await fetch(`/api/clients/${clientId}/contacts/${contact.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(data.error || "Couldn't remove the contact");
    toast.success("Contact removed");
    router.refresh();
  }

  const hasMain = !blank(main.name) || !blank(main.phone) || !blank(main.email);

  return (
    <section aria-labelledby="contacts-title" className="rounded-card border border-border bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="contacts-title" className="text-base font-semibold text-foreground">
          Contacts <span className="font-normal text-muted-foreground">({(hasMain ? 1 : 0) + contacts.length})</span>
        </h2>
        <Button size="sm" variant="secondary" onClick={() => open("new")}>
          <Plus /> Add contact
        </Button>
      </div>

      <ul className="divide-y divide-border">
        {hasMain && (
          <ContactRow name={blank(main.name) ? "—" : main.name!} designation={main.designation} phone={blank(main.phone) ? null : main.phone} email={main.email} badge="Main" />
        )}
        {contacts.map((c) => (
          <ContactRow
            key={c.id}
            name={c.name}
            designation={c.designation}
            phone={c.phone}
            email={c.email}
            actions={
              <>
                <Button variant="ghost" size="icon-sm" onClick={() => open(c)} aria-label={`Edit ${c.name}`} title="Edit">
                  <Pencil />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => remove(c)} aria-label={`Remove ${c.name}`} title="Remove" className="hover:bg-danger-soft hover:text-danger-foreground">
                  <Trash2 />
                </Button>
              </>
            }
          />
        ))}
        {!hasMain && contacts.length === 0 && <li className="py-4 text-sm text-muted-foreground">No contacts yet.</li>}
      </ul>
      {hasMain && <p className="mt-3 text-xs text-muted-foreground">The main contact is changed with Edit client.</p>}

      <Modal open={editing !== null} onClose={() => setEditing(null)}>
        <form onSubmit={save} className="space-y-4">
          <ModalHeader title={editing === "new" ? "Add contact" : "Edit contact"} onClose={() => setEditing(null)} />
          {error && (
            <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm font-medium text-danger-foreground">
              {error}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" required autoComplete="off" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Designation (optional)" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="e.g. Accounts Manager" />
            <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+974 …" />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@company.com" />
          </div>
          <p className="text-xs text-muted-foreground">Add a phone number, an email, or both.</p>
          <ModalFooter>
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing === "new" ? "Add contact" : "Save"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </section>
  );
}

function ContactRow({
  name,
  designation,
  phone,
  email,
  badge,
  actions,
}: {
  name: string;
  designation: string | null;
  phone: string | null;
  email: string | null;
  badge?: string;
  actions?: React.ReactNode;
}) {
  return (
    <li className="flex items-start justify-between gap-3 py-3">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <UserRound size={16} aria-hidden />
        </span>
        <div className="min-w-0 space-y-0.5">
          <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
            {name}
            {badge && <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary-soft-foreground">{badge}</span>}
          </p>
          {designation && <p className="text-xs text-muted-foreground">{designation}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {phone && (
              <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 text-foreground hover:text-primary">
                <Phone size={13} className="text-muted-foreground" aria-hidden /> {formatPhoneNumber(phone)}
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="inline-flex min-w-0 items-center gap-1.5 break-all text-foreground hover:text-primary">
                <Mail size={13} className="shrink-0 text-muted-foreground" aria-hidden /> {email}
              </a>
            )}
          </div>
        </div>
      </div>
      {actions && <div className="flex shrink-0">{actions}</div>}
    </li>
  );
}
