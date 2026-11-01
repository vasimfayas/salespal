import { UserRoundCheck } from "lucide-react";
import { getCoveringFor } from "@/lib/leave-badges";
import { formatDate } from "@/lib/utils";

/** Tells a cover whose work is showing in their lists while that person is on leave. */
export async function CoverBanner({ userId }: { userId: number }) {
  const covering = await getCoveringFor(userId);
  if (!covering.length) return null;
  return (
    <div role="status" className="mb-4 flex items-start gap-2 rounded-card border border-warning/40 bg-warning-soft px-4 py-2.5 text-sm text-warning-foreground">
      <UserRoundCheck size={16} className="mt-0.5 shrink-0" aria-hidden />
      <p>
        Covering for{" "}
        {covering.map((c, i) => (
          <span key={i}>
            {i > 0 && ", "}
            <span className="font-semibold">{c.user.name}</span> until {formatDate(c.end_date)}
          </span>
        ))}
        . Their clients, enquiries and tasks show in your lists.
      </p>
    </div>
  );
}
