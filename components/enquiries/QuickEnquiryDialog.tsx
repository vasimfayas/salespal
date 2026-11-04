"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Loader2, Zap } from "lucide-react";
import { ClientPicker } from "@/components/clients/ClientPicker";
import { LocationPicker } from "@/components/enquiries/LocationPicker";
import { Button } from "@/components/ui/Button";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { clientStatusLabel } from "@/types/client";

const MODES = [
  { value: "sea", label: "Sea" },
  { value: "air", label: "Air" },
  { value: "land", label: "Road" },
];

/**
 * Quick enquiry: client, mode and route only, so the salesman gets an enquiry ref to reply to the client's email with.
 * It's saved as "Details pending" and can't be quoted or sent until the full form is completed.
 */
export function QuickEnquiryDialog({
  open,
  onClose,
  companies,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  companies: { id: number; name: string }[];
  onCreated: (message: string) => void;
}) {
  const [client, setClient] = useState<{ id: number; name: string } | null>(null);
  const [orgId, setOrgId] = useState("");
  const [mode, setMode] = useState("sea");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const close = () => {
    onClose();
    setClient(null);
    setOrgId("");
    setMode("sea");
    setFrom("");
    setTo("");
    setError(null);
    setRef(null);
    setCopied(false);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!client) return setError("Select a client");
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quick: true, client_id: client.id, org_id: orgId ? Number(orgId) : null, mode, from, to }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Couldn't save the enquiry (server error ${res.status})`);
      setRef(data.enquiry.ref);
      onCreated(data.client_status ? `${data.enquiry.ref} created · client moved to ${clientStatusLabel(data.client_status)}` : `${data.enquiry.ref} created`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save the enquiry");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={close}>
      {ref ? (
        <div className="space-y-4">
          <ModalHeader title="Enquiry ref ready" onClose={close} description="Use it in your reply. Fill in the full details later with Complete details." />
          <div className="flex items-center gap-2">
            <input readOnly value={ref} aria-label="Enquiry ref" onFocus={(e) => e.target.select()} className="h-10 min-w-0 flex-1 rounded-control border border-input bg-subtle px-3 font-mono text-sm font-semibold text-foreground" />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={async () => {
                await navigator.clipboard.writeText(ref);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? <CheckCircle2 /> : <Copy />} {copied ? "Copied" : "Copy ref"}
            </Button>
          </div>
          <ModalFooter>
            <Button type="button" onClick={close}>
              Done
            </Button>
          </ModalFooter>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <ModalHeader
            title="Quick enquiry"
            onClose={close}
            description="Get an enquiry ref now. It can't be quoted or sent to agents until you complete the details."
          />
          {error && (
            <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm font-medium text-danger-foreground">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="quick-client" className="mb-1.5 block text-sm font-medium text-foreground">
              Client
            </label>
            <ClientPicker id="quick-client" required value={client} onChange={setClient} />
          </div>
          {companies.length > 1 && (
            <Select id="quick-company" label="Company" value={orgId} onChange={(e) => setOrgId(e.target.value)}>
              <option value="">Client&apos;s company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          )}
          <Select id="quick-mode" label="Mode" value={mode} onChange={(e) => setMode(e.target.value)}>
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
          <LocationPicker id="quick-from" label="From" required inline mode={mode} value={from} onChange={setFrom} placeholder="Origin port, airport or city" />
          <LocationPicker id="quick-to" label="To" required inline mode={mode} value={to} onChange={setTo} placeholder="Destination port, airport or city" />
          <ModalFooter>
            <Button type="button" variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Zap />} Get enquiry ref
            </Button>
          </ModalFooter>
        </form>
      )}
    </Modal>
  );
}
