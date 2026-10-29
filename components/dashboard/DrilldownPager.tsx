"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";

/** Page / rows-per-page footer for the drill-through lists; keeps both in the URL (?page=, ?size=). */
export function DrilldownPager({ page, pageSize, total }: { page: number; pageSize: number; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const go = (next: Record<string, number>) => {
    const q = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) q.set(k, String(v));
    router.push(`${pathname}?${q}`);
  };
  return <Pagination page={page} pageSize={pageSize} total={total} noun="records" onPage={(p) => go({ page: p })} onSize={(size) => go({ size, page: 1 })} />;
}
