"use client";

import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { useDebouncedParam, useUrlFilters } from "@/hooks/useUrlFilters";
import type { EnquiryPage } from "@/lib/enquiries";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { orderHref, orderNo, type AppRole } from "@/lib/record-links";
import { ArrowRight, BellRing, ChevronRight, ClipboardList, FilePenLine, MessageSquareText, Pencil, Plus, Send, X, Zap, type LucideIcon } from "lucide-react";
import { SendToClientDialog } from "@/components/enquiries/SendToClientDialog";
import { EnquiryDetailSheet } from "@/components/enquiries/EnquiryDetailSheet";
import { EnquiryPdfButton } from "@/components/enquiries/EnquiryPdfButton";
import { packageLinesPayload } from "@/components/enquiries/CargoDimensionsField";
import { EnquiryForm, emptyEnquiryForm, enquiryFormFrom } from "@/components/enquiries/EnquiryForm";
import { quoteLinesPayload } from "@/components/enquiries/QuoteLinesField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/Button";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { FollowUpModal } from "@/components/enquiries/EnquiryFollowUpModals";
import { EnquiryStageActions, rowActions, type Action } from "@/components/enquiries/EnquiryStageActions";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { PriorityFlag } from "@/components/enquiries/EnquiryPriority";
import { Toast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn, formatAmount, formatDate } from "@/lib/utils";
import { clientStatusLabel } from "@/types/client";
import {
  jobRefNames,
  type JobRef,
  type EnquiryStatus,
  enquiryStatuses,
  enquiryStatusLabels,
  isActiveEnquiry,
  type EnquiryListItem,
  shipmentSpec,
} from "@/types/enquiry";

import { PremiumBadge } from "@/components/clients/ClientCategory";
import { ApprovalChip, DetailsPendingChip } from "@/components/enquiries/ApprovalChip";
import { QuickEnquiryDialog } from "@/components/enquiries/QuickEnquiryDialog";
import { CopyRefButton } from "@/components/enquiries/CopyRefButton";
/** Anything short of Confirmed can still be corrected, except a form the client is still filling in. */
const canEditEnquiry = (e: EnquiryListItem) => e.status !== "confirmed" && e.status !== "sent_to_client";

/** Shown in place of the route while the client hasn't filled in the form yet. */
const AwaitingClient = () => <span className="text-sm italic text-muted-foreground">Waiting for the client to fill in the form</span>;

const FILTERS: { value: EnquiryStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  ...enquiryStatuses.map((value) => ({ value, label: enquiryStatusLabels[value] })),
];

const DAY_MS = 24 * 60 * 60 * 1000;
const daysOpen = (enquiryDate: string) => Math.max(0, Math.floor((Date.now() - new Date(`${enquiryDate}T00:00:00Z`).getTime()) / DAY_MS));

/** Server-paginated enquiries table. Status tab, search and page are URL params. */
export function EnquiriesClient({
  data,
  role,
  canCreate,
  canFollowUp = false,
  stageOnly,
  companies = [],
}: {
  data: EnquiryPage;
  /** Companies the user can raise enquiries under (salesmen / managers). */
  companies?: { id: number; name: string }[];
  /** Decides where order links go (see lib/record-links.ts). */
  role: AppRole;
  canCreate: boolean;
  /** Salesmen / managers: log follow-up comments and cancel open enquiries. */
  canFollowUp?: boolean;
  /** Without canFollowUp: the only stage moves offered (operations: quote / requote). */
  stageOnly?: Action[];
}) {
  const router = useRouter();
  const { get, set, isPending } = useUrlFilters();
  const filter = (get("status") || "all") as EnquiryStatus | "all";
  const [search, setSearch] = useDebouncedParam("q", set, get("q"));
  const [toast, setToast] = useState<string | undefined>();
  const enquiries = data.rows;

  // ?new=1 / ?send=1 (dashboard quick actions) open the new-enquiry / send-to-client dialogs.
  const [createOpen, setCreateOpen] = useState(() => canCreate && get("new") === "1");
  // Set while the form edits an existing enquiry instead of creating one.
  const [editing, setEditing] = useState<EnquiryListItem | null>(null);
  const [form, setForm] = useState(emptyEnquiryForm);
  const [client, setClient] = useState<{ id: number; name: string } | null>(null);
  // Company the new enquiry is raised under; "" = the client's company.
  const [orgId, setOrgId] = useState("");
  const [sendOpen, setSendOpen] = useState(() => canCreate && get("send") === "1");
  const [quickOpen, setQuickOpen] = useState(false);


  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ?followUp=<id> (deep link from a follow-up task) opens that enquiry even if it is on another page.
  const [followUpId, setFollowUpId] = useState<number | null>(data.focus?.id ?? null);
  const followUpFor =
    followUpId === null ? null : enquiries.find((e) => e.id === followUpId) ?? (data.focus?.id === followUpId ? data.focus : null);
  const closeFollowUp = () => {
    setFollowUpId(null);
    if (get("followUp")) set({ followUp: null, page: get("page") || null });
  };
  // Looked up by id so the panel shows fresh data after router.refresh().
  // ?view=<id> (link from an order or client page) opens that enquiry even if it is on another page.
  const [detailId, setDetailId] = useState<number | null>(() => Number(get("view")) || null);
  const detailFor =
    detailId === null ? null : enquiries.find((e) => e.id === detailId) ?? (data.focus?.id === detailId ? data.focus : null);
  const closeDetail = () => {
    setDetailId(null);
    if (get("view")) set({ view: null, page: get("page") || null });
  };
  const orderLink = (id: number) => orderHref(role, id);
  const followUpsDue = data.followUpsDue;
  const detailsPending = data.detailsPending;

  const visible = enquiries;

  function flash(message: string) {
    setToast(message);
    setTimeout(() => setToast(undefined), 3000);
  }

  async function post(url: string, body: unknown, method = "POST") {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setSaving(false);
    }
  }

  function openEdit(enquiry: EnquiryListItem) {
    setError(null);
    setDetailId(null);
    setEditing(enquiry);
    setForm(enquiryFormFrom(enquiry));
    setClient({ id: enquiry.client_id, name: enquiry.client_name });
    setCreateOpen(true);
  }

  async function submitCreate(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      const data = await post(
        `/api/enquiries/${editing.id}`,
        { ...form, packages: packageLinesPayload(form.packages), credit_days: form.payment_mode === "credit" ? Number(form.credit_days) : null },
        "PATCH",
      );
      if (!data) return;
      setCreateOpen(false);
      flash(data.changed.length ? `${editing.ref} updated` : "No changes to save");
      router.refresh();
      return;
    }
    if (!client) {
      setError("Select a client");
      return;
    }
    const data = await post("/api/enquiries", {
      ...form,
      client_id: client.id,
      org_id: orgId ? Number(orgId) : null,
      packages: packageLinesPayload(form.packages),
      credit_days: form.payment_mode === "credit" ? Number(form.credit_days) : null,
      // No lines → "Inquiry received" (quote later); lines → "Quoted" with cost / profit from them.
      quote_lines: quoteLinesPayload(form.quote_lines),
    });
    if (!data) return;
    setCreateOpen(false);
    flash(data.client_status ? `Enquiry created · client moved to ${clientStatusLabel(data.client_status)}` : "Enquiry created");
    router.refresh();
  }


  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-card border border-border/80 bg-card p-3 shadow-card">
        {/* One line of tabs; scrolls sideways when the screen is too narrow. */}
        <div className="flex w-full gap-1 overflow-x-auto rounded-xl bg-muted p-1 [scrollbar-width:none]" role="tablist" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => set({ status: f.value })}
              className={cn(
                "shrink-0 cursor-pointer whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
                filter === f.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
              <span className="ml-1 text-muted-foreground/80">
                {data.counts[f.value].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
        {(data.companies.length > 1 || get("company")) && (
          <Select
            aria-label="Filter by company"
            value={get("company") ?? ""}
            onChange={(ev) => set({ company: ev.target.value || null })}
            wrapperClassName="w-full sm:w-40"
            className="h-9"
          >
            <option value="">All companies</option>
            {data.companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.count.toLocaleString()})
              </option>
            ))}
          </Select>
        )}
        {role === "admin" && data.managers.length > 0 && (
          <Select
            aria-label="Filter by manager's team"
            value={get("manager") ?? ""}
            onChange={(ev) => set({ manager: ev.target.value || null, salesman: null })}
            wrapperClassName="w-full sm:w-40"
            className="h-9"
          >
            <option value="">All managers</option>
            {data.managers.map((m) => (
              <option key={m.id} value={m.id}>{m.name}&apos;s team</option>
            ))}
          </Select>
        )}
        {(role === "admin" || role === "manager") && (data.raisers.length > 1 || get("salesman")) && (
          <Select
            aria-label="Filter by who raised the enquiry"
            value={get("salesman") ?? ""}
            onChange={(ev) => set({ salesman: ev.target.value || null })}
            wrapperClassName="w-full sm:w-40"
            className="h-9"
          >
            <option value="">{role === "manager" ? "All salesmen" : "All people"}</option>
            {data.raisers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}{r.role_id === 2 ? " (manager)" : r.role_id === 3 ? "" : " (owner)"} ({r.count.toLocaleString()})
              </option>
            ))}
          </Select>
        )}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search enquiries…"
          title="Search by enquiry ref, client or job no"
          aria-label="Search enquiries"
          className="w-full rounded-control border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-ring focus:ring-3 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 h-9 min-w-[140px] flex-1 basis-full sm:basis-0"
        />
        <SimpleTooltip label="Download a blank enquiry form">
          <EnquiryPdfButton enquiry={null} label="Blank form" iconOnly className="size-9" />
        </SimpleTooltip>
        {canCreate && (
          <SimpleTooltip label="Send the enquiry form to a client">
            <Button size="icon-sm" variant="secondary" onClick={() => setSendOpen(true)} aria-label="Send to client" className="size-9">
              <Send />
            </Button>
          </SimpleTooltip>
        )}
        {canCreate && (
          <Button size="sm" variant="secondary" onClick={() => setQuickOpen(true)}>
            <Zap /> Quick enquiry
          </Button>
        )}
        {canCreate && (
          <button
            onClick={() => {
              setError(null);
              setEditing(null);
              setForm(emptyEnquiryForm());
              setClient(null);
              setOrgId("");
              setCreateOpen(true);
            }}
            className={buttonVariants({ size: "sm" })}
          >
            <Plus size={14} />
            <span>New enquiry</span>
          </button>
        )}
      </div>

      {canFollowUp && (followUpsDue > 0 || detailsPending > 0 || get("flag")) && (
        <div className="flex flex-wrap gap-2">
          {(followUpsDue > 0 || get("flag") === "follow_up") && (
            <FlagBanner
              icon={BellRing}
              active={get("flag") === "follow_up"}
              onToggle={(on) => set({ flag: on ? "follow_up" : null })}
              title="Log a follow-up or cancel with a reason"
            >
              {followUpsDue} follow-up{followUpsDue === 1 ? "" : "s"} due
            </FlagBanner>
          )}
          {(detailsPending > 0 || get("flag") === "pending") && (
            <FlagBanner
              icon={FilePenLine}
              active={get("flag") === "pending"}
              onToggle={(on) => set({ flag: on ? "pending" : null })}
              title="Quick enquiries: open each one and press Complete details"
            >
              {detailsPending} quick enquir{detailsPending === 1 ? "y needs" : "ies need"} details
            </FlagBanner>
          )}
        </div>
      )}

      {/* Table (lg+) / cards (phones & tablets). Row click opens every field in the detail panel. */}
      {visible.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={data.counts.all === 0 && !search ? "No enquiries yet" : "No enquiries match"}
          message={data.counts.all === 0 && !search && canCreate ? "Create an enquiry to capture a client's shipping request." : undefined}
        />
      ) : (
        <div className={cn("space-y-1 transition-opacity", isPending && "opacity-60")} aria-busy={isPending}>
          <Pagination page={data.page} pageSize={data.pageSize} total={data.total} pending={isPending} noun="enquiries" onPage={(p) => set({ page: p })} onSize={(n) => set({ size: n })} />
          <div className="hidden overflow-hidden rounded-card border border-border bg-card shadow-card lg:block">
            <table className="w-full table-fixed text-left text-sm">
              <thead className="border-b border-border text-muted-foreground text-[13px]">
                <tr>
                  <th scope="col" className="w-[22%] px-4 py-3 font-medium">Enquiry</th>
                  <th scope="col" className="px-4 py-3 font-medium">Client</th>
                  <th scope="col" className="w-[22%] px-4 py-3 font-medium">Route</th>
                  <th scope="col" className="hidden w-[13%] px-4 py-3 text-right font-medium xl:table-cell">Selling price</th>
                  <th scope="col" className="w-[136px] px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="w-[184px] px-4 py-3 text-right font-medium"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visible.map((e) => {
                  const converted = e.actual_cost !== null;
                  return (
                    <tr
                      key={e.id}
                      onClick={() => setDetailId(e.id)}
                      className="group cursor-pointer transition-colors hover:bg-subtle"
                    >
                      <td className="px-4 py-3 align-top">
                        <span className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setDetailId(e.id);
                            }}
                            aria-label={`View details for ${e.ref}`}
                            className="cursor-pointer rounded font-mono text-[13px] font-semibold text-foreground group-hover:text-primary"
                          >
                            {e.ref}
                          </button>
                          <CopyRefButton value={e.ref} />
                        </span>
                        <CompanyTag name={e.company.name} />
                        <PriorityFlag priority={e.priority} className="my-0.5 flex" />
                        {/* Who raised it, highlighted: the manager's list is grouped by it. */}
                        <span className="block truncate text-xs text-muted-foreground">
                          {formatDate(e.enquiry_date)} · <span className="font-semibold text-foreground">{e.created_by}</span>
                        </span>
                        {isActiveEnquiry(e.status) && (
                          <span className={cn("block text-xs", e.follow_up_due ? "font-medium text-warning-foreground" : "text-muted-foreground")}>
                            Active {daysOpen(e.enquiry_date)}d{e.follow_up_due ? " · follow-up due" : ""}
                          </span>
                        )}
                        <ApprovalChip enquiry={e} className="block w-fit" />
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className="line-clamp-2 font-medium text-foreground">
                          {e.client_name}
                          <PremiumBadge category={e.client_category} compact className="ml-1 align-[-2px]" />
                        </span>
                        {e.job_ref && <span className="block truncate text-xs text-muted-foreground">{e.job_ref} · {jobRefNames[e.job_ref as JobRef] ?? ""}</span>}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {e.status === "sent_to_client" ? (
                          <AwaitingClient />
                        ) : (
                          <>
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                              {e.mode}
                              {e.is_dg && <DgBadge unNumber={e.un_number} />}
                            </span>
                            <span className="block truncate text-foreground" title={e.from}>{e.from}</span>
                            <span className="flex min-w-0 items-center gap-1 text-foreground" title={e.to}>
                              <ArrowRight size={12} className="shrink-0 text-muted-foreground" aria-label="to" />
                              <span className="truncate">{e.to}</span>
                            </span>
                            {shipmentSpec(e) && <span className="block truncate text-xs tabular-nums text-muted-foreground">{shipmentSpec(e)}</span>}
                          </>
                        )}
                      </td>
                      <td className="hidden px-4 py-3 text-right align-top tabular-nums xl:table-cell">
                        {e.provisional_cost === null ? (
                          <span className="text-xs text-muted-foreground">Not quoted</span>
                        ) : (
                          <>
                            {/* Selling price = cost + profit (actual once converted to an order). */}
                            <span className="block font-medium text-foreground">
                              {formatAmount(converted ? e.actual_cost! + (e.actual_profit ?? 0) : e.provisional_cost + (e.provisional_profit ?? 0))}
                            </span>
                            {!converted && <span className="block text-xs text-muted-foreground/80">Quoted</span>}
                          </>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <StatusBadge status={e.status} />
                        <DetailsPendingChip pending={e.details_pending} className="flex w-fit" />
                        {e.order && (
                          <OrderChip id={e.order.id} jobNo={e.order.job_no} href={orderLink(e.order.id)} />
                        )}
                      </td>
                      <td className="px-4 py-3 text-right align-top" onClick={(ev) => ev.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {canFollowUp && e.details_pending && canEditEnquiry(e) && (
                            <Button size="sm" onClick={() => openEdit(e)}>
                              <FilePenLine /> Complete
                            </Button>
                          )}
                          {canFollowUp && !e.details_pending && rowActions(e.status).length > 0 && !e.follow_up_due && (
                            <div className="flex flex-col-reverse items-end gap-1">
                              <EnquiryStageActions enquiry={e} only={rowActions(e.status)} onDone={flash} />
                            </div>
                          )}
                          {!canFollowUp && stageOnly && <EnquiryStageActions enquiry={e} only={stageOnly} onDone={flash} />}
                          {canFollowUp && isActiveEnquiry(e.status) && e.follow_up_due && (
                            <Button
                              size="sm"
                              variant={e.follow_up_due ? "primary" : "secondary"}
                              onClick={() => setFollowUpId(e.id)}
                              className={cn(e.follow_up_due && "bg-warning text-white hover:bg-warning/90 dark:text-foreground")}
                            >
                              <MessageSquareText /> Follow up
                              {e.follow_ups.length > 0 && <span className="opacity-70">{e.follow_ups.length}</span>}
                            </Button>
                          )}
                          {canFollowUp && canEditEnquiry(e) && (
                            <SimpleTooltip label="Edit enquiry">
                              <Button size="icon-sm" variant="ghost" onClick={() => openEdit(e)} aria-label={`Edit ${e.ref}`}>
                                <Pencil />
                              </Button>
                            </SimpleTooltip>
                          )}
                          <ChevronRight size={16} className="shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground" aria-hidden />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards below lg */}
          <ul className="grid gap-2.5 sm:grid-cols-2 lg:hidden">
            {visible.map((e) => (
              <li key={e.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setDetailId(e.id)}
                  className="w-full min-w-0 cursor-pointer rounded-card border border-border bg-card p-4 text-left shadow-card transition-colors active:bg-subtle"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-[13px] font-semibold text-foreground">{e.ref}</p>
                      <CompanyTag name={e.company.name} />
                      <PriorityFlag priority={e.priority} className="my-0.5 flex" />
                      <p className="flex items-center gap-1 truncate text-sm font-medium text-foreground">
                        <span className="truncate">{e.client_name}</span>
                        <PremiumBadge category={e.client_category} compact />
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <StatusBadge status={e.status} />
                      {/* Plain text: the card is a button; the order link is in the detail panel it opens. */}
                      {e.order && <OrderChip id={e.order.id} jobNo={e.order.job_no} href={null} />}
                    </div>
                  </div>
                  {e.status === "sent_to_client" ? (
                    <p className="mt-2">
                      <AwaitingClient />
                    </p>
                  ) : (
                    <p className="mt-2 flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
                      <span className="text-[11px] font-semibold uppercase">{e.mode}</span>
                      {e.is_dg && <DgBadge unNumber={e.un_number} />}
                      <span aria-hidden>·</span>
                      <span className="truncate">{e.from}</span>
                      <ArrowRight size={12} className="shrink-0" aria-label="to" />
                      <span className="truncate">{e.to}</span>
                    </p>
                  )}
                  {shipmentSpec(e) && <p className="mt-0.5 break-words text-xs tabular-nums text-muted-foreground">{shipmentSpec(e)}</p>}
                  <ApprovalChip enquiry={e} className="block w-fit" />
                  <DetailsPendingChip pending={e.details_pending} className="flex w-fit" />
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {formatDate(e.enquiry_date)} · <span className="font-semibold text-foreground">{e.created_by}</span>
                    </span>
                    {isActiveEnquiry(e.status) && (
                      <span className={cn(e.follow_up_due && "font-medium text-warning-foreground")}>
                        Active {daysOpen(e.enquiry_date)}d{e.follow_up_due ? " · follow-up due" : ""}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <Pagination page={data.page} pageSize={data.pageSize} total={data.total} pending={isPending} noun="enquiries" onPage={(p) => set({ page: p })} onSize={(n) => set({ size: n })} />
        </div>
      )}

      <EnquiryDetailSheet
        enquiry={detailFor}
        daysOpen={daysOpen}
        canFollowUp={canFollowUp}
        stageOnly={stageOnly}
        onClose={closeDetail}
        orderLink={orderLink}
        onEdit={canFollowUp ? openEdit : undefined}
        onFollowUp={(e) => {
          setDetailId(null);
          setFollowUpId(e.id);
        }}
        onDone={(message) => {
          flash(message);
          router.refresh();
        }}
      />

      <QuickEnquiryDialog
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
        companies={companies}
        onCreated={(message) => {
          flash(message);
          router.refresh();
        }}
      />

      <SendToClientDialog
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        companies={companies}
        onSent={() => router.refresh()}
      />

      {/* Create / edit enquiry */}
      <Modal onClose={() => setCreateOpen(false)} open={createOpen} size="xl" className="p-0">
        <EnquiryForm
          form={form}
          setForm={setForm}
          editing={editing}
          client={client}
          setClient={setClient}
          companies={companies}
          orgId={orgId}
          setOrgId={setOrgId}
          error={error}
          saving={saving}
          onSubmit={submitCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>


      <FollowUpModal
        enquiry={followUpFor}
        canAdd={canFollowUp}
        onClose={closeFollowUp}
        onSaved={() => {
          closeFollowUp();
          flash("Follow-up saved");
          router.refresh();
        }}
      />

      <Toast message={toast} />
    </div>
  );
}

/** Warning pill that filters the list to the enquiries it counts; click again to show all. */
function FlagBanner({ icon: Icon, active, onToggle, title, children }: { icon: LucideIcon; active: boolean; onToggle: (on: boolean) => void; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      title={title}
      onClick={() => onToggle(!active)}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-warning/25",
        active ? "border-warning bg-warning text-white dark:text-foreground" : "border-warning/30 bg-warning-soft text-warning-foreground hover:border-warning/60",
      )}
    >
      <Icon size={13} className="shrink-0" aria-hidden />
      {children}
      {active && <X size={12} className="shrink-0 opacity-80" aria-label="Clear filter" />}
    </button>
  );
}

/** "Order #00012 · JOB-1" under the status; a link when the role has somewhere to go. */
function OrderChip({ id, jobNo, href }: { id: number; jobNo: string | null; href: string | null }) {
  const text = `${orderNo(id)}${jobNo ? ` · ${jobNo}` : ""}`;
  return href ? (
    <Link
      href={href}
      onClick={(ev) => ev.stopPropagation()}
      className="mt-1 block truncate font-mono text-xs text-primary hover:underline"
      title="Open order"
    >
      {text}
    </Link>
  ) : (
    <span className="mt-1 block truncate font-mono text-xs text-muted-foreground">{text}</span>
  );
}

/** Dangerous-goods marker; the UN number(s) are in the tooltip and for screen readers. */
function DgBadge({ unNumber }: { unNumber: string | null }) {
  const text = `Dangerous goods${unNumber ? ` · ${unNumber}` : ""}`;
  return (
    <span title={text} className="shrink-0 rounded bg-warning-soft px-1 py-px text-[10px] font-semibold tracking-wide text-warning-foreground">
      DG<span className="sr-only"> — {text}</span>
    </span>
  );
}

/** Which of our companies the enquiry is raised under. */
function CompanyTag({ name }: { name: string }) {
  return (
    <span title={name} className="my-0.5 block w-fit max-w-full truncate rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
      {name}
    </span>
  );
}
