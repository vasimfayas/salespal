"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { titleCase } from "@/lib/utils";
import { missingContactFields } from "@/lib/client-contact";

export type ContactPromptTarget = {
  client: {
    id: number;
    name: string;
    contact_person_name?: string | null;
    contact_no?: string | null;
    contact_person_designation?: string | null;
  };
  status: string;
};

const fieldClass =
  "h-10 w-full rounded-control border border-input bg-card px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/15";

/**
 * Shown when a client without contact details is moved past Lead.
 * Saves the contact details and the new status in one request.
 */
export function ContactDetailsDialog({
  target,
  onClose,
  onSaved,
}: {
  target: ContactPromptTarget | null;
  onClose: () => void;
  onSaved: (status: string) => void;
}) {
  return (
    <Dialog open={!!target} onOpenChange={(open) => !open && onClose()}>
      {target && (
        <DialogContent
          title={target.status === "follow_up" ? "Schedule a follow-up" : "Add contact details"}
          description={
            target.status === "follow_up"
              ? `${target.client.name} is moving to Follow up. Pick the date to follow up; a task is created for it.`
              : `${target.client.name} is moving to ${titleCase(target.status)}. Add who you're talking to.`
          }
        >
          <ContactForm key={`${target.client.id}-${target.status}`} target={target} onClose={onClose} onSaved={onSaved} />
        </DialogContent>
      )}
    </Dialog>
  );
}

function ContactForm({ target, onClose, onSaved }: { target: ContactPromptTarget; onClose: () => void; onSaved: (status: string) => void }) {
  const { client, status } = target;
  const [form, setForm] = useState({
    contact_person_name: client.contact_person_name ?? "",
    contact_no: client.contact_no ?? "",
    contact_person_designation: client.contact_person_designation ?? "",
  });
  const needsContact = missingContactFields(client).length > 0;
  const needsDate = status === "follow_up";
  const [followUpDate, setFollowUpDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/clients/${client.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...(needsContact ? form : {}), ...(needsDate ? { follow_up_date: followUpDate } : {}) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to save contact details");
      onSaved(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save contact details");
    } finally {
      setSaving(false);
    }
  }

  const field = (key: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        required
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className={fieldClass}
        {...props}
      />
    </label>
  );

  return (
    <form onSubmit={submit}>
      <DialogBody className="space-y-4">
        {error && (
          <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm text-danger-foreground">
            {error}
          </p>
        )}
        {needsContact && (
          <>
            {field("contact_person_name", "Contact person", { placeholder: "Full name", autoFocus: true, autoComplete: "off" })}
            <div className="grid gap-4 sm:grid-cols-2">
              {field("contact_no", "Phone number", { type: "tel", placeholder: "e.g. +97455556666" })}
              {field("contact_person_designation", "Designation", { placeholder: "e.g. Logistics Manager" })}
            </div>
          </>
        )}
        {needsDate && (
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">Follow-up date</span>
            <input
              required
              type="date"
              min={new Date().toLocaleDateString("en-CA")}
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              autoFocus={!needsContact}
              className={fieldClass}
            />
          </label>
        )}
      </DialogBody>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {needsDate ? "Save & schedule follow-up" : `Save & move to ${titleCase(status)}`}
        </Button>
      </DialogFooter>
    </form>
  );
}
