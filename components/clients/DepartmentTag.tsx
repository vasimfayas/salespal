import { Network } from "lucide-react";
import { cn } from "@/lib/utils";

/** Department of a company handled per department; renders nothing for ordinary clients. */
export function DepartmentTag({ department, className }: { department?: string | null; className?: string }) {
  if (!department) return null;
  return (
    <span
      title={`Department: ${department}`}
      className={cn("inline-flex max-w-full items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground", className)}
    >
      <Network size={11} aria-hidden className="shrink-0" />
      <span className="truncate">{department}</span>
    </span>
  );
}
