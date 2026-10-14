"use client";

import { useState } from "react";
import { Download, FileUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { downloadCsv, parseCsv } from "@/lib/csv";

/** CSV columns (Excel opens and saves CSV). Several emails / phones / modes in one cell are separated by ";". */
export const AGENT_COLUMNS = ["name", "contact_person", "emails", "phones", "country", "network", "code", "modes"] as const;
const EXAMPLE = ["Gulf Freight Partners", "Ali Khan", "ali@gulf.com; ops@gulf.com", "+97455556666; +97444443333", "Qatar", "WCA", "GFP01", "air; sea"];

export function downloadAgentTemplate() {
  downloadCsv("agents-import-template.csv", [[...AGENT_COLUMNS], EXAMPLE]);
}

const split = (v: string) => v.split(/[;\n]/).map((x) => x.trim()).filter(Boolean);

/** Imports agents one row at a time through the normal add-agent API, so every row gets the usual validation. */
export function BulkImportAgentsModal({ open, onClose, onImported }: { open: boolean; onClose: () => void; onImported: () => void }) {
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failed, setFailed] = useState<string[]>([]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setMessage(null);
    setFailed([]);
    const parsed = parseCsv((await file.text()).replace(/^﻿/, ""));
    const headers = (parsed[0] ?? []).map((h) => h.trim().toLowerCase());
    if (parsed.length < 2 || !headers.includes("name") || !headers.includes("emails")) {
      setMessage("Use the template: it needs at least the name and emails columns and one agent per row.");
      return;
    }
    setRunning(true);
    const errors: string[] = [];
    let added = 0;
    for (const [i, cells] of parsed.slice(1).entries()) {
      const get = (col: string) => (cells[headers.indexOf(col)] ?? "").trim();
      const emails = split(get("emails"));
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: get("name"),
          contact_person: get("contact_person"),
          email: emails[0] ?? "",
          extra_emails: emails.slice(1),
          phone: split(get("phones"))[0] ?? "",
          extra_phones: split(get("phones")).slice(1),
          country: get("country"),
          network: get("network"),
          code: get("code"),
          modes: split(get("modes")).map((m) => m.toLowerCase()),
        }),
      }).catch(() => null);
      if (res?.ok) added++;
      else errors.push(`Row ${i + 2} (${get("name") || "no name"}): ${(await res?.json().catch(() => ({})))?.error ?? "Network error"}`);
    }
    setRunning(false);
    setFailed(errors);
    setMessage(`${added} agent${added === 1 ? "" : "s"} added, ${errors.length} skipped.`);
    if (added) onImported();
  }

  return (
    <Modal open={open} onClose={() => !running && onClose()}>
      <div className="space-y-4">
        <ModalHeader title="Import agents" onClose={onClose} />
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-subtle p-3">
          <p className="text-xs text-foreground/70">
            Required: <span className="font-semibold">name, emails</span>. Separate several emails, phones or modes with “;”.
          </p>
          <Button type="button" variant="secondary" size="sm" onClick={downloadAgentTemplate}>
            <Download size={13} /> Template
          </Button>
        </div>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed border-border-strong bg-card p-6 text-center hover:bg-subtle">
          <FileUp size={22} className="text-muted-foreground/80" />
          <span className="text-sm font-semibold text-foreground/85">{running ? "Importing…" : "Choose a CSV file"}</span>
          <input type="file" accept=".csv,text/csv" className="sr-only" disabled={running} onChange={(e) => handleFile(e.target.files?.[0])} />
        </label>
        {message && <p role="status" className="text-sm font-medium text-foreground">{message}</p>}
        {failed.length > 0 && (
          <ul className="max-h-48 overflow-y-auto rounded-lg border border-border p-2 text-xs text-danger-foreground">
            {failed.map((f) => <li key={f}>{f}</li>)}
          </ul>
        )}
        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose} disabled={running}>Close</Button>
        </ModalFooter>
      </div>
    </Modal>
  );
}
