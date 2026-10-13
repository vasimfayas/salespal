"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, FileSignature, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { labelClass } from "@/components/ui/field-styles";
import { ApprovalTimeline } from "@/components/approvals/ApprovalTimeline";
import { createCreditRequest } from "@/lib/actions/approval-actions";
import { cn, formatDate } from "@/lib/utils";
import type { ApprovalLogEntry, ApprovalType, CreditAgreementData } from "@/types/approval";

type Latest = { id: number; type: ApprovalType; status: string; current_step: number; waiting_on: string | null; data: Record<string, unknown>; log: ApprovalLogEntry[] } | null;

const EMPTY = { qatari_in_cr: "no", credit_days: "", shipments: "", duty: "", do: "", request: "" };

/** Credit Agreement: approved credit (if any), the latest request's progress and log, and the request form. */
export function CreditRequestPanel({
  clientId,
  credit,
  latest,
  canRequest,
  companies,
  defaults,
}: {
  clientId: number;
  credit: { approved: boolean; days: number | null; at: string | null };
  latest: Latest;
  canRequest: boolean;
  companies: { id: number; name: string }[];
  defaults: { org_id: number | null; salesperson: string; customer_name: string; cr_no: string | null; cr_expiry: string | null };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [orgId, setOrgId] = useState(defaults.org_id ? String(defaults.org_id) : "");
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = latest?.status === "pending";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await createCreditRequest(clientId, {
      org_id: Number(orgId),
      qatari_in_cr: form.qatari_in_cr === "yes",
      credit_days: Number(form.credit_days),
      shipments: Number(form.shipments || 0),
      duty: form.duty,
      do: form.do,
      request: form.request,
    });
    setSaving(false);
    if (!res.success) return setError(res.error);
    toast.success(res.message ?? "Credit request sent");
    setOpen(false);
    setForm(EMPTY);
    router.refresh();
  }

  const data = latest?.data as Partial<CreditAgreementData> | undefined;

  return (
    <section className="rounded-card border border-border bg-card p-6 shadow-card" aria-labelledby="credit-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 id="credit-title" className="flex items-center gap-2 text-base font-semibold text-foreground">
          <FileSignature size={17} className="text-muted-foreground" aria-hidden /> Credit agreement
        </h2>
        {canRequest && !pending && (
          <Button size="sm" variant="soft" onClick={() => { setError(null); setOpen(true); }} disabled={companies.length === 0}>
            <Plus /> Create credit request
          </Button>
        )}
      </div>

      <p
        className={cn(
          "mb-4 flex items-center gap-1.5 rounded-control px-3 py-2 text-sm",
          credit.approved ? "bg-success-soft text-success-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        {credit.approved ? (
          <>
            <BadgeCheck size={15} aria-hidden /> Credit approved{credit.days ? ` · ${credit.days} days` : ""}
            {credit.at && <span className="text-xs opacity-80"> · since {formatDate(credit.at)}</span>}
          </>
        ) : (
          "No approved credit. Credit enquiries for this client need manager approval."
        )}
      </p>

      {latest ? (
        <div className="space-y-3 rounded-control border border-border p-3">
          <p className="text-sm font-medium text-foreground">
            Latest request ·{" "}
            <span className={cn(latest.status === "approved" ? "text-success-foreground" : latest.status === "rejected" ? "text-danger-foreground" : "text-warning-foreground")}>
              {latest.status === "pending" ? `waiting on ${latest.waiting_on}` : latest.status}
            </span>
          </p>
          {data && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-3">
              {[
                ["Company", data.company],
                ["Credit days", data.credit_days],
                ["Shipments", data.shipments],
                ["Qatari in CR", data.qatari_in_cr ? "Yes" : "No"],
                ["Duty", data.duty || "—"],
                ["DO", data.do || "—"],
              ].map(([k, v]) => (
                <div key={String(k)}>
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium text-foreground">{String(v ?? "—")}</dd>
                </div>
              ))}
            </dl>
          )}
          <ApprovalTimeline type={latest.type} status={latest.status} currentStep={latest.current_step} log={latest.log} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No credit request yet.</p>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <ModalHeader title="Credit request" description="Goes to Accounts, then the Manager, then the Owner for approval." onClose={() => setOpen(false)} />
          {error && (
            <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm font-medium text-danger-foreground">
              {error}
            </p>
          )}
          <Select id="credit-company" label="Company" required value={orgId} onChange={(e) => setOrgId(e.target.value)}>
            <option value="">Select a company…</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          {/* Filled in from the client record */}
          <dl className="grid grid-cols-2 gap-3 rounded-control bg-subtle p-3 text-sm">
            {[
              ["Salesperson", defaults.salesperson],
              ["Customer name", defaults.customer_name],
              ["CR no", defaults.cr_no ?? "Not on file"],
              ["CR expiry", defaults.cr_expiry ? formatDate(defaults.cr_expiry) : "Not on file"],
            ].map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="truncate font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>

          <div>
            <span className={labelClass}>Qatari in CR</span>
            <SegmentedControl
              label="Qatari in CR"
              value={form.qatari_in_cr as "yes" | "no"}
              onChange={(v) => setForm({ ...form, qatari_in_cr: v })}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input id="credit-days" label="Credit days" type="number" required min={1} max={365} value={form.credit_days} onChange={(e) => setForm({ ...form, credit_days: e.target.value })} />
            <Input id="credit-shipments" label="No. of shipments" type="number" min={0} value={form.shipments} onChange={(e) => setForm({ ...form, shipments: e.target.value })} />
            <Input id="credit-duty" label="Duty" value={form.duty} onChange={(e) => setForm({ ...form, duty: e.target.value })} placeholder="e.g. 5,000 or Client pays" />
            <Input id="credit-do" label="DO" value={form.do} onChange={(e) => setForm({ ...form, do: e.target.value })} placeholder="e.g. 1,000" />
          </div>
          <Textarea id="credit-request" label="Request" required maxLength={2000} value={form.request} onChange={(e) => setForm({ ...form, request: e.target.value })} placeholder="What is being asked and why" />
          <ModalFooter>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Send for approval
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </section>
  );
}
