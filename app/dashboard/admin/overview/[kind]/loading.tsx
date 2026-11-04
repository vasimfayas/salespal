import { Skeleton } from "@/components/ui/Skeleton";
import { HeaderSkeleton, TableSkeleton } from "@/components/ui/PageSkeleton";

/** Shown at once when a dashboard tile is opened, while its records load. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="animate-page-in">
      <Skeleton className="mb-4 h-4 w-32" />
      <HeaderSkeleton />
      <TableSkeleton toolbar={false} />
    </div>
  );
}
