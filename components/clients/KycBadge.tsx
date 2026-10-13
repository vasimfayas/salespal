import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/** "KYC not updated": CR, computer card or signatory ID is missing or expired (see kycStatus in types/client.ts). */
export function KycBadge({ ok, className }: { ok?: boolean; className?: string }) {
  if (ok !== false) return null;
  return (
    <span
      className={cn("inline-flex w-fit items-center gap-1 rounded-full bg-danger-soft px-1.5 py-px text-[10px] font-semibold text-danger-foreground", className)}
      title="CR, computer card or authorised signatory ID is missing or expired"
    >
      <ShieldAlert size={10} aria-hidden /> KYC not updated
    </span>
  );
}
