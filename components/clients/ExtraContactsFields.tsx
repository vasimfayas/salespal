"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export type ExtraContactInput = { name: string; designation: string; phone: string; email: string };

export const emptyExtraContact = (): ExtraContactInput => ({ name: "", designation: "", phone: "", email: "" });

/** Rows that have nothing typed in are left out of the request. */
export const filledContacts = (rows: ExtraContactInput[]) => rows.filter((r) => Object.values(r).some((v) => v.trim()));

/** "Additional contacts" in the add-client form: any number of extra people, each name + designation + phone / email. */
export function ExtraContactsFields({ value, onChange, max = 10 }: { value: ExtraContactInput[]; onChange: (next: ExtraContactInput[]) => void; max?: number }) {
  const update = (i: number, patch: Partial<ExtraContactInput>) => onChange(value.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  return (
    <fieldset className="space-y-3 rounded-control border border-border p-3">
      <legend className="px-1 text-xs font-semibold text-foreground/85">Additional contacts (optional)</legend>
      {value.map((c, i) => (
        <div key={i} className="space-y-2 rounded-control bg-subtle p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Contact {i + 2}</span>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`Remove contact ${i + 2}`}>
              <Trash2 />
            </Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Input label="Name" required value={c.name} onChange={(e) => update(i, { name: e.target.value })} className="text-xs" />
            <Input label="Designation (optional)" value={c.designation} onChange={(e) => update(i, { designation: e.target.value })} className="text-xs" />
            <Input label="Phone" type="tel" value={c.phone} onChange={(e) => update(i, { phone: e.target.value })} placeholder="+974 …" className="text-xs" />
            <Input label="Email" type="email" value={c.email} onChange={(e) => update(i, { email: e.target.value })} className="text-xs" />
          </div>
        </div>
      ))}
      {value.length < max && (
        <Button type="button" variant="secondary" size="sm" onClick={() => onChange([...value, emptyExtraContact()])}>
          <Plus /> Add another contact
        </Button>
      )}
      <p className="text-[11px] text-muted-foreground">Each needs a name and a phone or an email. They appear under Contacts on the client page.</p>
    </fieldset>
  );
}
