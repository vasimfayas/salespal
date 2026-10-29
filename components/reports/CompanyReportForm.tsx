"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Download, FileText, Loader2, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useLocations } from "@/hooks/useLocations";
import { reportParts, reportPartLabels, type ReportPart } from "@/lib/report-parts";
import { REPORT_KEEP_DAYS, reportDaysLeft } from "@/lib/report-retention";
import { cn } from "@/lib/utils";

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

type Job = { ahead?: number; created_at: string; id: number; status: "queued" | "running" | "done" | "failed"; params: { org: number; from: string; to: string; staff?: number[]; mode?: string; from_country?: string; to_country?: string; parts?: string[] }; file_name: string | null; error: string | null };

/** Pick a company and a date range; the report is built in the background (worker) and listed below when ready. */
export function CompanyReportForm({ companies, staff }: { companies: { id: number; name: string }[]; staff: { id: number; name: string; orgIds: number[] }[] }) {
  const [orgId, setOrgId] = useState(companies[0]?.id ? String(companies[0].id) : "");
  const [from, setFrom] = useState(() => iso(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
  const [to, setTo] = useState(() => iso(new Date()));
  const [staffSel, setStaffSel] = useState<number[]>([]);
  const [mode, setMode] = useState("");
  const [fromCountry, setFromCountry] = useState("");
  const [toCountry, setToCountry] = useState("");
  const [parts, setParts] = useState<ReportPart[]>(["orders", "enquiries", "lost"]);
  const locations = useLocations();
  const countries = [...new Set((locations ?? []).map((l) => l.country))].sort();
  const orgStaff = staff.filter((x) => x.orgIds.includes(Number(orgId)));
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const valid = parts.length > 0 && Boolean(orgId && from && to && from <= to);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [typical, setTypical] = useState(10);
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const companyName = (id: number) => companies.find((c) => c.id === id)?.name ?? `Company ${id}`;

  const load = useCallback(async () => {
    const res = await fetch("/api/reports/jobs").catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      setJobs(data.jobs);
      setTypical(data.typical_seconds);
    }
  }, []);
  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);
  // Poll while anything is still being built.
  const pending = jobs.some((j) => j.status === "queued" || j.status === "running");
  useEffect(() => {
    if (!pending) return;
    const timer = setInterval(() => {
      setNow(Date.now());
      load();
    }, 1000);
    return () => clearInterval(timer);
  }, [pending, load]);

  async function generate() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/reports/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ org: Number(orgId), from, to, staff: staffSel, mode, from_country: fromCountry, to_country: toCountry, parts }) }).catch(() => null);
    if (!res?.ok) setError((await res?.json().catch(() => null))?.error ?? "Could not start the report. Try again.");
    else await load();
    setBusy(false);
  }

  if (companies.length === 0) {
    return <p className="rounded-card border border-border bg-card p-6 text-sm text-muted-foreground shadow-card">No companies to report on yet.</p>;
  }

  return (
    <section aria-labelledby="company-report-title" className="rounded-card border border-border bg-card p-6 shadow-card">
      <h2 id="company-report-title" className="text-base font-semibold text-foreground">
        Company report
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        PDF with the company logo: overall summary (order value, provisional profit, enquiries, lost with reasons), each staff member&apos;s performance and
        target status, then the detailed orders, enquiries and lost items.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Select id="report-company" label="Company" value={orgId} onChange={(e) => {
            setOrgId(e.target.value);
            setStaffSel([]);
          }}>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Input id="report-from" label="From" type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} required />
        <Input id="report-to" label="To" type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} required />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Select id="report-mode" label="Mode" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="">All modes</option>
          <option value="sea">Sea</option>
          <option value="air">Air</option>
          <option value="land">Land</option>
        </Select>
        <Select id="report-from-country" label="From country" value={fromCountry} onChange={(e) => setFromCountry(e.target.value)}>
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
        <Select id="report-to-country" label="To country" value={toCountry} onChange={(e) => setToCountry(e.target.value)}>
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </div>

      <ChipGroup label="Staff" hint={staffSel.length ? `${staffSel.length} selected` : "All staff"} empty="No staff are linked to this company yet." onClear={staffSel.length ? () => setStaffSel([]) : undefined}>
        {orgStaff.map((x) => (
          <Chip key={x.id} on={staffSel.includes(x.id)} onClick={() => setStaffSel(toggle(staffSel, x.id))}>
            {x.name}
          </Chip>
        ))}
      </ChipGroup>

      <ChipGroup label="Include in the detailed tables" hint="Pick at least one">
        {reportParts.map((p) => (
          <Chip key={p} on={parts.includes(p)} onClick={() => setParts(toggle(parts, p))}>
            {reportPartLabels[p]}
          </Chip>
        ))}
      </ChipGroup>
      {from && to && from > to ? (
        <p role="alert" className="mt-2 text-sm text-danger-foreground">
          The start date must be on or before the end date.
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button disabled={!valid || busy} onClick={generate}>
          {busy ? <Loader2 className="animate-spin" /> : <FileText />} Generate report
        </Button>
        <p className="text-xs text-muted-foreground">It is prepared in the background — you can keep working.</p>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-danger-foreground">
          {error}
        </p>
      ) : null}

      {jobs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground">Your recent reports</h3>
          <ul className="mt-2 divide-y divide-border rounded-card border border-border" aria-live="polite">
            {jobs.map((job) => (
              <li key={job.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-sm">
                <span className="min-w-0">
                  <span className="font-medium text-foreground">{companyName(job.params.org)}</span>
                  <span className="text-muted-foreground"> · {job.params.from} to {job.params.to}</span>
                  <FilterNote params={job.params} />
                </span>
                {job.status === "done" ? (
                  <span className="flex items-center gap-2">
                    <ExpiryNote createdAt={job.created_at} now={now} />
                    <CheckCircle2 size={14} className="text-success-foreground" aria-hidden />
                    <Button asChild size="sm">
                      <a href={`/api/reports/jobs/${job.id}/file`} target="_blank" rel="noopener">
                        <FileText /> Open
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="secondary">
                      <a href={`/api/reports/jobs/${job.id}/file?download=1`} download>
                        <Download /> Download
                      </a>
                    </Button>
                    <DeleteButton id={job.id} onDone={load} />
                  </span>
                ) : job.status === "failed" ? (
                  <span className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-danger-foreground" title={job.error ?? undefined}>
                      <XCircle size={14} aria-hidden /> Failed
                    </span>
                    <DeleteButton id={job.id} onDone={load} />
                  </span>
                ) : (
                  <Progress job={job} now={now} typical={typical} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/** No real progress is available from the PDF builder, so the bar eases toward 90% over the typical build time. */
function Progress({ job, now, typical }: { job: Job; now: number; typical: number }) {
  const elapsed = Math.max(0, Math.round((now - new Date(job.created_at).getTime()) / 1000));
  const waiting = job.status === "queued";
  const pct = waiting ? 5 : Math.min(90, Math.round((elapsed / typical) * 90));
  return (
    <span className="flex min-w-[220px] flex-col gap-1 text-xs text-muted-foreground" role="status">
      <span className="flex items-center gap-1.5">
        <Loader2 size={13} className="animate-spin" aria-hidden />
        {waiting ? (job.ahead ? `Waiting · ${job.ahead} report${job.ahead === 1 ? "" : "s"} ahead` : "Starting…") : `Building… ${elapsed}s`}
        <span className="ml-auto">usually ~{typical}s</span>
      </span>
      <span className="h-1.5 overflow-hidden rounded-full bg-muted">
        <span className="block h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${pct}%` }} />
      </span>
    </span>
  );
}

/** "Deleted in 12 days": finished reports are removed after REPORT_KEEP_DAYS, so download what you need before then. */
function ExpiryNote({ createdAt, now }: { createdAt: string; now: number }) {
  const left = reportDaysLeft(createdAt, now);
  return (
    <span className={cn("text-xs", left <= 3 ? "font-medium text-warning-foreground" : "text-muted-foreground")} title={`Reports are kept ${REPORT_KEEP_DAYS} days, then deleted`}>
      {left === 0 ? "Deleted today" : `Deleted in ${left} day${left === 1 ? "" : "s"}`}
    </span>
  );
}

const partLabels = reportPartLabels as Record<string, string>;

/** What a report was narrowed to, e.g. "Sea · From China · 2 staff · Orders, Lost enquiries & orders". Nothing for an unfiltered one. */
function FilterNote({ params: p }: { params: Job["params"] }) {
  const bits = [p.mode && p.mode[0].toUpperCase() + p.mode.slice(1), p.from_country && `From ${p.from_country}`, p.to_country && `To ${p.to_country}`, p.staff?.length && `${p.staff.length} staff`].filter(Boolean);
  if (bits.length === 0) return null;
  return <span className="block text-xs text-muted-foreground">{bits.join(" · ")}{p.parts ? ` · ${p.parts.map((x) => partLabels[x] ?? x).join(", ")}` : ""}</span>;
}

function ChipGroup({ label, hint, empty, onClear, children }: { label: string; hint?: string; empty?: string; onClear?: () => void; children: React.ReactNode }) {
  const none = Array.isArray(children) && children.length === 0;
  return (
    <div className="mt-4">
      <div className="mb-1.5 flex items-center gap-2 text-sm">
        <span className="font-medium text-foreground">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        {onClear && (
          <button type="button" onClick={onClear} className="cursor-pointer text-xs text-primary hover:underline">
            Clear
          </button>
        )}
      </div>
      <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto">{none ? <span className="text-xs text-muted-foreground">{empty}</span> : children}</div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        on ? "border-primary bg-primary-soft text-primary-soft-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function DeleteButton({ id, onDone }: { id: number; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      size="sm"
      variant="secondary"
      disabled={busy}
      aria-label="Delete report"
      title="Delete this report"
      onClick={async () => {
        if (!window.confirm("Delete this report? The PDF is removed and cannot be recovered.")) return;
        setBusy(true);
        await fetch(`/api/reports/jobs/${id}`, { method: "DELETE" }).catch(() => null);
        await onDone();
        setBusy(false);
      }}
    >
      {busy ? <Loader2 className="animate-spin" /> : <Trash2 />}
    </Button>
  );
}
