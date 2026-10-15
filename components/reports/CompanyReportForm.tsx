"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Download, FileText, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

type Job = { ahead?: number; created_at: string; id: number; status: "queued" | "running" | "done" | "failed"; params: { org: number; from: string; to: string }; file_name: string | null; error: string | null };

/** Pick a company and a date range; the report is built in the background (worker) and listed below when ready. */
export function CompanyReportForm({ companies }: { companies: { id: number; name: string }[] }) {
  const [orgId, setOrgId] = useState(companies[0]?.id ? String(companies[0].id) : "");
  const [from, setFrom] = useState(() => iso(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
  const [to, setTo] = useState(() => iso(new Date()));
  const valid = Boolean(orgId && from && to && from <= to);
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
    const res = await fetch("/api/reports/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ org: Number(orgId), from, to }) }).catch(() => null);
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
        <Select id="report-company" label="Company" value={orgId} onChange={(e) => setOrgId(e.target.value)}>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Input id="report-from" label="From" type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} required />
        <Input id="report-to" label="To" type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} required />
      </div>
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
                </span>
                {job.status === "done" ? (
                  <span className="flex items-center gap-2">
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
                  </span>
                ) : job.status === "failed" ? (
                  <span className="flex items-center gap-1.5 text-danger-foreground" title={job.error ?? undefined}>
                    <XCircle size={14} aria-hidden /> Failed
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
