"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Loader2, MailWarning, Send } from "lucide-react";
import { ClientPicker } from "@/components/clients/ClientPicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";

type Result = { ref: string; url: string; emailed: boolean; emailError: string | null; email: string };

/** Copies a link and briefly confirms it on the button. */
export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? <CheckCircle2 /> : <Copy />} {copied ? "Copied" : "Copy link"}
    </Button>
  );
}

/**
 * "Send to client": pick the client and the company, and the client's contact gets an emailed link to a fillable,
 * signable enquiry form. The enquiry starts as "Sent to client" until they submit it.
 */
export function SendToClientDialog({
  open,
  onClose,
  companies,
  onSent,
}: {
  open: boolean;
  onClose: () => void;
  companies: { id: number; name: string }[];
  onSent: () => void;
}) {
  const [client, setClient] = useState<{ id: number; name: string } | null>(null);
  const [orgId, setOrgId] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  function reset() {
    setClient(null);
    setOrgId("");
    setEmail("");
    setContact(null);
    setError(null);
    setResult(null);
  }

  // Prefill the client's contact email (still editable).
  async function pickClient(next: { id: number; name: string } | null) {
    setClient(next);
    setEmail("");
    setContact(null);
    if (!next) return;
    const res = await fetch(`/api/clients/${next.id}`);
    if (!res.ok) return;
    const { client: c } = await res.json();
    setEmail(c?.mail_id ?? "");
    setContact(c?.contact_person_name && c.contact_person_name !== "-" ? c.contact_person_name : null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!client) return setError("Select a client");
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/enquiries/send-to-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: client.id, org_id: orgId ? Number(orgId) : null, email }),
      });
      // A crashed request can come back with an empty / non-JSON body.
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || `Couldn't send the form (server error ${res.status}). Please try again.`);
      setResult({ ref: data.enquiry.ref, url: data.url, emailed: data.emailed, emailError: data.email_error, email });
      onSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send the form");
    } finally {
      setSaving(false);
    }
  }

  const close = () => {
    onClose();
    reset();
  };

  return (
    <Modal open={open} onClose={close}>
      {result ? (
        <div className="space-y-4">
          <ModalHeader
            title={result.emailed ? "Enquiry form sent" : "Enquiry created — share the link"}
            onClose={close}
            description={`${result.ref} is waiting for the client as "Sent to client".`}
          />
          {result.emailed ? (
            <p className="flex items-start gap-2 rounded-control bg-success-soft px-3 py-2.5 text-sm text-success-foreground">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden /> Emailed to {result.email}.
            </p>
          ) : (
            <p className="flex items-start gap-2 rounded-control bg-warning-soft px-3 py-2.5 text-sm text-warning-foreground">
              <MailWarning size={16} className="mt-0.5 shrink-0" aria-hidden />
              {result.emailError ?? "Email isn't set up yet, so nothing was sent."} Copy the link and send it to the client yourself.
            </p>
          )}
          <div className="flex items-center gap-2">
            <input readOnly value={result.url} aria-label="Form link" onFocus={(e) => e.target.select()} className="h-9 min-w-0 flex-1 rounded-control border border-input bg-subtle px-3 text-xs text-foreground" />
            <CopyLinkButton url={result.url} />
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
            title="Send enquiry form to client"
            onClose={close}
            description="The client gets a link to fill in the shipment details and sign. Payment terms and the quote are added by you later."
          />
          {error && (
            <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm font-medium text-danger-foreground">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="send-client" className="mb-1.5 block text-sm font-medium text-foreground">
              Client
            </label>
            <ClientPicker id="send-client" required value={client} onChange={pickClient} />
          </div>
          {companies.length > 1 && (
            <Select id="send-company" label="Company" value={orgId} onChange={(e) => setOrgId(e.target.value)}>
              <option value="">Client&apos;s company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          )}
          <Input
            label="Send to email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@client.com"
            hint={contact ? `Contact person: ${contact}` : client ? "No email on file for this client. Type one to send to." : undefined}
          />
          <ModalFooter>
            <Button type="button" variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Send />} Send form
            </Button>
          </ModalFooter>
        </form>
      )}
    </Modal>
  );
}
