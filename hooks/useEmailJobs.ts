"use client";

import { useEffect, useState } from "react";
import type { EmailJobStatus } from "@/lib/email-queue";

export type EmailState = "queued" | "sent" | "failed" | "not_configured";

/** Follows queued emails (by job id) until each is sent or has failed. Polls every 2 s, up to 2 minutes; unknown ids count as queued. */
export function useEmailJobs(ids: number[]) {
  const key = ids.join(",");
  const [jobs, setJobs] = useState<Record<number, EmailJobStatus>>({});
  useEffect(() => {
    if (!key) return;
    let live = true;
    const until = Date.now() + 120_000;
    const tick = async () => {
      const data = await fetch(`/api/email-jobs?ids=${key}`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
      if (!live) return;
      const next = Object.fromEntries((data?.jobs ?? []).map((j: EmailJobStatus) => [j.id, j]));
      if (data) setJobs(next);
      const pending = key.split(",").some((id) => (next[Number(id)]?.status ?? "queued") === "queued");
      if (pending && Date.now() < until) timer = setTimeout(tick, 2000);
    };
    let timer = setTimeout(tick, 800);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [key]);
  return (id: number): EmailState => jobs[id]?.status ?? "queued";
}
