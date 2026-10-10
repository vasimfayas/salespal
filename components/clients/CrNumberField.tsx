"use client";

import { useEffect, useState } from "react";
import { Building2, CheckCircle2, Loader2, Network, UserRound } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** A company already on file with this CR, as GET /api/clients?cr= returns it (names only). */
export type CrMatch = {
  id: number;
  name: string;
  org_id: number;
  org_name: string;
  can_add_department: boolean;
  departments: { id: number; department: string | null; salesman: string }[];
};

type Lookup = { cr: string; company: CrMatch | null; failed?: boolean };

/**
 * First field of the add-client form: as the CR No is typed, shows whether the company already exists,
 * who handles it (per department), and offers to add a new department of it instead of a duplicate.
 */
export function CrNumberField({
  value,
  onChange,
  departmentOf,
  onAddDepartment,
  onCancelDepartment,
}: {
  value: string;
  onChange: (value: string) => void;
  /** Set while the form is adding a department of this company. */
  departmentOf: CrMatch | null;
  onAddDepartment: (company: CrMatch) => void;
  onCancelDepartment: () => void;
}) {
  const cr = value.trim().toUpperCase();
  const [lookup, setLookup] = useState<Lookup | null>(null);

  useEffect(() => {
    if (cr.length < 3) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/clients?cr=${encodeURIComponent(cr)}`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((data) => setLookup({ cr, company: data.company ?? null }))
        .catch(() => {
          if (!controller.signal.aborted) setLookup({ cr, company: null, failed: true });
        });
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [cr]);

  const current = cr.length >= 3 && lookup?.cr === cr ? lookup : null;
  const checking = cr.length >= 3 && !current;
  const company = current?.company ?? null;

  return (
    <div className="space-y-2">
      <Input
        label="CR No"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Commercial registration number"
        hint="Start here: we'll check whether this company is already in SalesPal."
        className="text-xs"
        autoFocus
      />

      <div aria-live="polite">
        {checking && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 size={12} className="animate-spin" aria-hidden /> Checking CR number…
          </p>
        )}

        {current && !company && !current.failed && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-success-foreground">
            <CheckCircle2 size={13} aria-hidden /> New company. Fill in the details below.
          </p>
        )}

        {company && departmentOf?.id === company.id && (
          <div className="flex items-start justify-between gap-3 rounded-lg border border-info/30 bg-info-soft px-3 py-2.5 text-xs text-info-foreground">
            <p>
              Adding a new department of <strong className="font-semibold">{company.name}</strong>. It gets its own contact person and
              salesman.
            </p>
            <button type="button" onClick={onCancelDepartment} className="shrink-0 cursor-pointer font-semibold underline-offset-2 hover:underline">
              Cancel
            </button>
          </div>
        )}

        {company && departmentOf?.id !== company.id && (
          <div className="space-y-2.5 rounded-lg border border-warning/30 bg-warning-soft/60 p-3 text-xs">
            <div className="flex items-start gap-2">
              <Building2 size={15} className="mt-px shrink-0 text-warning-foreground" aria-hidden />
              <p className="text-foreground">
                <strong className="font-semibold">{company.name}</strong> is already registered
                <span className="text-muted-foreground"> · {company.org_name}</span>
              </p>
            </div>
            <ul className="space-y-1 border-t border-warning/20 pt-2">
              {company.departments.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-1.5 text-foreground/85">
                    <Network size={12} className="shrink-0 text-muted-foreground" aria-hidden />
                    <span className="truncate">{d.department ?? "Main account"}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
                    <UserRound size={12} aria-hidden />
                    {d.salesman}
                  </span>
                </li>
              ))}
            </ul>
            {company.can_add_department ? (
              <button type="button" onClick={() => onAddDepartment(company)} className={cn(buttonVariants({ size: "sm", variant: "secondary" }), "w-full")}>
                <Network /> Add a new department
              </button>
            ) : (
              <p className="text-muted-foreground">It&apos;s handled under {company.org_name}, which you don&apos;t work for, so you can&apos;t add a department to it.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
