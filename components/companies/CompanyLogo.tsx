"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Building, ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { COMPANY_LOGO_ACCEPT } from "@/types/company";

/** The company's logo, or a building icon when it has none. */
export function CompanyLogo({ url, name, className }: { url: string | null; name: string; className?: string }) {
  return (
    <span className={cn("flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-control", url ? "bg-white ring-1 ring-border" : "bg-primary-soft text-primary-soft-foreground", className)}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={`${name} logo`} className="size-full object-contain p-1" />
      ) : (
        <Building className="size-1/2" aria-hidden />
      )}
    </span>
  );
}

/** Owner view: click the logo to upload / replace it; × removes it. */
export function CompanyLogoEditor({ orgId, name, url }: { orgId: number; name: string; url: string | null }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function send(method: "POST" | "DELETE", file?: File) {
    setBusy(true);
    try {
      const body = file ? new FormData() : undefined;
      if (file) body!.append("file", file);
      const res = await fetch(`/api/companies/${orgId}/logo`, { method, body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to update the logo");
      toast.success(method === "POST" ? "Logo updated" : "Logo removed");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update the logo");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <span className="group relative shrink-0">
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={busy}
        aria-label={url ? `Change ${name} logo` : `Upload ${name} logo`}
        title={url ? "Change logo" : "Upload logo (PNG or JPG)"}
        className="relative block cursor-pointer rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-wait"
      >
        <CompanyLogo url={url} name={name} className="size-12" />
        <span className="absolute inset-0 flex items-center justify-center rounded-control bg-foreground/55 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <ImagePlus size={16} aria-hidden />}
        </span>
      </button>
      {url && !busy && (
        <button
          type="button"
          onClick={() => confirm(`Remove the ${name} logo?`) && send("DELETE")}
          aria-label={`Remove ${name} logo`}
          title="Remove logo"
          className="absolute -right-1.5 -top-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground opacity-0 shadow-xs transition-opacity hover:text-danger-foreground group-hover:opacity-100 focus-visible:opacity-100"
        >
          <X size={11} aria-hidden />
        </button>
      )}
      <input
        ref={input}
        type="file"
        accept={COMPANY_LOGO_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) send("POST", file);
        }}
      />
    </span>
  );
}
