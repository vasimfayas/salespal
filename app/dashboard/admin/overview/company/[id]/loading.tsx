import { Skeleton } from "@/components/ui/Skeleton";
import { HeaderSkeleton, TableSkeleton } from "@/components/ui/PageSkeleton";

/** Shown at once when a company card is opened, while its clients and history load. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="animate-page-in">
      <Skeleton className="mb-4 h-4 w-32" />
      <HeaderSkeleton />
      <div className="mb-4 rounded-card border border-border bg-card p-5 shadow-card">
        <Skeleton className="mb-3 h-4 w-32" />
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-[68px] rounded-control" />
          ))}
        </div>
      </div>
      <TableSkeleton toolbar={false} />
    </div>
  );
}
