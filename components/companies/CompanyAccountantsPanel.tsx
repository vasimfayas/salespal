"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Calculator, Plus, UserMinus, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { assignAccountantToOrg, assignOperationsToOrg, removeAccountantFromOrg, removeOperationsFromOrg } from "@/lib/actions/company-actions";

import { buttonVariants } from "@/components/ui/Button";
type Person = { id: number; name: string; email: string; phone: string | null };

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

const KINDS = {
  accountant: {
    title: "Accountants",
    one: "accountant",
    sees: "enquiries and orders",
    assign: assignAccountantToOrg,
    remove: removeAccountantFromOrg,
  },
  operations: {
    title: "Operations",
    one: "operations user",
    sees: "enquiries to quote",
    assign: assignOperationsToOrg,
    remove: removeOperationsFromOrg,
  },
} as const;

/** Accountants or operations staff assigned to a company — they only see that company's records. */
export function CompanyAccountantsPanel({
  orgId,
  orgName,
  assigned,
  allAccountants,
  labelClass,
  kind = "accountant",
}: {
  orgId: number;
  orgName: string;
  assigned: Person[];
  allAccountants: Person[];
  labelClass: string;
  kind?: keyof typeof KINDS;
}) {
  const k = KINDS[kind];
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [local, setLocal] = useState(assigned);
  const [synced, setSynced] = useState(assigned);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState("");

  // Re-sync optimistic state when the server sends fresh data.
  if (assigned !== synced) {
    setSynced(assigned);
    setLocal(assigned);
  }

  const available = allAccountants.filter((a) => !local.some((l) => l.id === a.id));

  const run = (optimistic: Person[], action: () => Promise<{ success: boolean; error?: string }>) => {
    const backup = local;
    setLocal(optimistic);
    setError("");
    startTransition(async () => {
      try {
        const res = await action();
        if (!res.success) throw new Error(res.error);
        router.refresh();
      } catch (e) {
        setLocal(backup);
        setError(e instanceof Error && e.message ? e.message : "Something went wrong.");
      }
    });
  };

  const handleAssign = (accountant: Person) => {
    setPickerOpen(false);
    run([...local, accountant], () => k.assign(accountant.id, orgId));
  };

  const handleRemove = (accountant: Person) => {
    if (!confirm(`Remove ${accountant.name} from ${orgName}? They will stop seeing this company's ${k.sees}.`)) return;
    run(
      local.filter((l) => l.id !== accountant.id),
      () => k.remove(accountant.id, orgId)
    );
  };

  return (
    <section className="space-y-3" aria-label={`${k.title} for ${orgName}`}>
      <div className="flex items-center justify-between gap-2">
        <h3 className={`text-xs font-semibold ${labelClass}`}>{k.title} ({local.length})</h3>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className={buttonVariants({ variant: "secondary", size: "sm" })}
        >
          <Plus size={12} /> Assign {k.one}
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-danger/30 bg-danger-soft p-2 text-[11px] font-medium text-danger-foreground">
          {error}
        </p>
      )}

      <div className="rounded-card border border-border/70 bg-card p-3 space-y-2">
        {local.map((a) => (
          <div key={a.id} className="flex items-center justify-between gap-2 rounded-xl border border-border p-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                {initials(a.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">{a.name}</p>
                <p className="truncate text-[10px] text-muted-foreground" title={a.email}>
                  {a.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(a)}
              disabled={isPending}
              aria-label={`Remove ${a.name}`}
              title={`Remove ${k.one}`}
              className="shrink-0 rounded p-1 text-muted-foreground/80 transition hover:bg-danger-soft hover:text-danger-foreground cursor-pointer disabled:opacity-50"
            >
              <UserMinus size={14} />
            </button>
          </div>
        ))}

        {local.length === 0 && (
          <div className="flex flex-col items-center gap-1 py-4 text-center">
            <Calculator size={18} className="text-muted-foreground/60" aria-hidden />
            <p className="text-[11px] italic text-muted-foreground/80">No {k.one} assigned. This company&apos;s {k.sees} aren&apos;t visible to any {k.one}.</p>
          </div>
        )}
      </div>

      <Modal onClose={() => setPickerOpen(false)} open={pickerOpen}>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-semibold text-primary">Assign {k.one} to {orgName}</h3>
            <button
              type="button"
              onClick={() => setPickerOpen(false)}
              aria-label="Close"
              className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
            >
              <X size={16} />
            </button>
          </div>
          <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
            {available.map((a) => (
              <button
                type="button"
                key={a.id}
                onClick={() => handleAssign(a)}
                className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition hover:border-primary/30 hover:bg-primary-soft/30 cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                  {initials(a.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">{a.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground/80">{a.email}</p>
                </div>
                <span className="rounded bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-primary">Assign</span>
              </button>
            ))}
            {available.length === 0 && (
              <p className="py-6 text-center text-xs italic text-muted-foreground/80">
                {allAccountants.length === 0
                  ? `No ${k.one}s yet. Create one from the Users page.`
                  : `Every ${k.one} is already assigned to this company.`}
              </p>
            )}
          </div>
        </div>
      </Modal>
    </section>
  );
}
