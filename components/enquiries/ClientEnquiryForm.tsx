"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { EnquiryForm, Section, emptyEnquiryForm } from "@/components/enquiries/EnquiryForm";
import { packageLinesPayload } from "@/components/enquiries/CargoDimensionsField";
import { SignaturePad } from "@/components/enquiries/SignaturePad";
import { Input } from "@/components/ui/Input";

/** The enquiry form a client opened from an emailed link: shipment details, then their name and signature. */
export function ClientEnquiryForm({ token, companyName, defaultSigner }: { token: string; companyName: string; defaultSigner: string }) {
  const [form, setForm] = useState(emptyEnquiryForm);
  const [signedName, setSignedName] = useState(defaultSigner);
  const [signature, setSignature] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!signature) return setError("Sign in the signature box before submitting.");
    setSaving(true);
    try {
      const res = await fetch(`/api/enquiry-form/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, packages: packageLinesPayload(form.packages), signed_name: signedName, signature }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't submit the form. Please try again.");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't submit the form. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="animate-page-in rounded-card border border-border bg-card p-8 text-center shadow-card">
        <CheckCircle2 className="mx-auto size-10 text-success-foreground" aria-hidden />
        <h2 className="mt-3 text-lg font-semibold text-foreground">Thank you, your enquiry is in</h2>
        <p className="mt-1 text-sm text-muted-foreground">{companyName} will review it and send you a quote.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-border bg-card shadow-card">
      <EnquiryForm form={form} setForm={setForm} editing={null} error={error} saving={saving} onSubmit={submit} variant="client">
        <Section title="Sign" hint="Type your name and sign to confirm these details.">
          <div className="grid gap-4 sm:max-w-md">
            <Input label="Full name" required autoComplete="name" value={signedName} onChange={(e) => setSignedName(e.target.value)} />
            <div>
              <span id="sign-pad-label" className="mb-1.5 block text-sm font-medium text-foreground">
                Signature
              </span>
              <SignaturePad onChange={setSignature} labelledBy="sign-pad-label" />
            </div>
            <label className="flex cursor-pointer items-start gap-2 text-sm text-foreground">
              <input type="checkbox" required checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 size-4 cursor-pointer" />
              I confirm the shipment details above are correct.
            </label>
          </div>
        </Section>
      </EnquiryForm>
    </div>
  );
}
