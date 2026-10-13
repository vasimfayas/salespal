import Link from "next/link";
import { CheckCircle2, FileSignature, Inbox, ReceiptText } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { prisma } from "@/lib/prisma";
import { ApprovalTimeline } from "@/components/approvals/ApprovalTimeline";
import { ApprovalDecision } from "@/components/approvals/ApprovalDecision";
import { APPROVAL_FLOWS, APPROVAL_KEEP_MONTHS, approvalQueueWhere, approvalScopeWhere, getApprovalViews, type ApprovalView, type Approver } from "@/lib/approvals";
import { enquiryHref, type AppRole } from "@/lib/record-links";
import { enquiryRef } from "@/types/enquiry";
import type { CreditAgreementData, EnquiryApprovalData } from "@/types/approval";
import { cn, formatAmount, formatDate, titleCase } from "@/lib/utils";

/**
 * Approvals screen: "Waiting on me" (requests at the user's step) and "Decided" (the last 6 months the user can see).
 * `basePath` is this role's approvals page, for the tab links.
 */
export async function ApprovalsView({ user, role, tab, basePath, clientHref }: { user: Approver; role: AppRole; tab: string; basePath: string; clientHref?: (id: number) => string }) {
  const decided = tab === "decided";
  const since = new Date();
  since.setMonth(since.getMonth() - APPROVAL_KEEP_MONTHS);
  const [queueWhere, scope] = await Promise.all([approvalQueueWhere(user), approvalScopeWhere(user)]);
  const [items, waitingCount] = await Promise.all([
    getApprovalViews(decided ? { AND: [scope, { status: { not: "pending" }, decided_at: { gte: since } }] } : queueWhere, 100),
    prisma.approvalRequest.count({ where: queueWhere }),
  ]);

  return (
    <div className="space-y-4">
      <nav className="inline-flex rounded-control bg-muted p-0.5" aria-label="Approvals">
        {[
          { key: "", label: `Waiting on me${waitingCount ? ` (${waitingCount})` : ""}` },
          { key: "decided", label: "Decided" },
        ].map((t) => (
          <Link
            key={t.key}
            href={t.key ? `${basePath}?tab=${t.key}` : basePath}
            aria-current={(t.key === "decided") === decided ? "page" : undefined}
            className={cn(
              "rounded-[calc(var(--radius-control)-2px)] px-3 py-1.5 text-sm font-medium",
              (t.key === "decided") === decided ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {items.length === 0 ? (
        <EmptyState
          icon={decided ? Inbox : CheckCircle2}
          title={decided ? "Nothing decided yet" : "Nothing waiting on you"}
          message={decided ? `Decisions from the last ${APPROVAL_KEEP_MONTHS} months show here.` : "Credit agreements and enquiry quotes that need your approval appear here."}
        />
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <ApprovalCard key={item.id} item={item} role={role} canDecide={!decided} clientHref={clientHref} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ApprovalCard({ item, role, canDecide, clientHref }: { item: ApprovalView; role: AppRole; canDecide: boolean; clientHref?: (id: number) => string }) {
  const Icon = item.type === "credit_agreement" ? FileSignature : ReceiptText;
  return (
    <li className="flex flex-col gap-3 rounded-card border border-border bg-card p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Icon size={13} aria-hidden /> {APPROVAL_FLOWS[item.type].label}
          </p>
          <h3 className="mt-0.5 truncate font-semibold text-foreground">
            {clientHref ? (
              <Link href={clientHref(item.client.id)} className="hover:text-primary hover:underline">
                {item.client.name}
              </Link>
            ) : (
              item.client.name
            )}
          </h3>
          <p className="text-xs text-muted-foreground">
            {item.company} · requested by {item.requested_by} · {formatDate(item.created_at)}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
            item.status === "approved" && "bg-success-soft text-success-foreground",
            item.status === "rejected" && "bg-danger-soft text-danger-foreground",
            item.status === "pending" && "bg-warning-soft text-warning-foreground",
            item.status === "cancelled" && "bg-muted text-muted-foreground",
          )}
        >
          {item.status === "pending" ? `Waiting on ${item.waiting_on}` : titleCase(item.status)}
        </span>
      </div>

      {item.type === "credit_agreement" ? <CreditDetails data={item.data as unknown as CreditAgreementData} /> : <EnquiryDetails item={item} role={role} />}

      <ApprovalTimeline type={item.type} status={item.status} currentStep={item.current_step} log={item.log} />
      {canDecide && <ApprovalDecision requestId={item.id} />}
    </li>
  );
}

function Fields({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-control bg-subtle p-3 text-sm sm:grid-cols-3">
      {rows.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="text-xs text-muted-foreground">{k}</dt>
          <dd className="truncate font-medium text-foreground">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function CreditDetails({ data }: { data: CreditAgreementData }) {
  return (
    <>
      <Fields
        rows={[
          ["Salesperson", data.salesperson],
          ["CR no", data.cr_no ?? "—"],
          ["CR expiry", data.cr_expiry ? formatDate(data.cr_expiry) : "—"],
          ["Qatari in CR", data.qatari_in_cr ? "Yes" : "No"],
          ["Credit days", data.credit_days],
          ["Shipments", data.shipments],
          ["Duty", data.duty || "—"],
          ["DO", data.do || "—"],
        ]}
      />
      <p className="whitespace-pre-line text-sm text-foreground">
        <span className="font-medium">Request: </span>
        {data.request}
      </p>
    </>
  );
}

function EnquiryDetails({ item, role }: { item: ApprovalView; role: AppRole }) {
  const q = item.data as unknown as EnquiryApprovalData;
  const value = q.cost + q.profit;
  return (
    <>
      {item.enquiry_id && (
        <Link href={enquiryHref(role, item.enquiry_id)} className="w-fit font-mono text-sm font-semibold text-primary hover:underline">
          {enquiryRef(item.enquiry_id, item.org_prefix)}
        </Link>
      )}
      <Fields
        rows={[
          ["Route", `${titleCase(q.mode)} · ${q.from} → ${q.to}`],
          ["Cost", formatAmount(q.cost)],
          ["Profit", `${formatAmount(q.profit)}${value > 0 ? ` (${((q.profit / value) * 100).toFixed(1)}%)` : ""}`],
          ["Quote", formatAmount(value)],
          ["Payment", q.payment_mode === "credit" ? `Credit · ${q.credit_days ?? "?"} days` : titleCase(q.payment_mode)],
        ]}
      />
    </>
  );
}
