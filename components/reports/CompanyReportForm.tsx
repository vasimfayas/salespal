"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Pick a company and a date range, then open or download the company report PDF (GET /api/reports/company). */
export function CompanyReportForm({ companies }: { companies: { id: number; name: string }[] }) {
  const [orgId, setOrgId] = useState(companies[0]?.id ? String(companies[0].id) : "");
  const [from, setFrom] = useState(() => iso(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
  const [to, setTo] = useState(() => iso(new Date()));
  const valid = Boolean(orgId && from && to && from <= to);
  const href = (download: boolean) => `/api/reports/company?org=${orgId}&from=${from}&to=${to}${download ? "&download=1" : ""}`;

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

      <div className="mt-5 flex flex-wrap gap-2">
        {valid ? (
          <>
            <Button asChild>
              <a href={href(false)} target="_blank" rel="noopener">
                <FileText /> Generate report
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href={href(true)} download>
                <Download /> Download PDF
              </a>
            </Button>
          </>
        ) : (
          <Button disabled>
            <FileText /> Generate report
          </Button>
        )}
      </div>
    </section>
  );
}
