"use client";

import { createContext, useContext, useTransition } from "react";
import { cn } from "@/lib/utils";

type Ctx = { pending: boolean; start: (fn: () => void) => void };
const DashboardTransitionContext = createContext<Ctx>({ pending: false, start: (fn) => fn() });

/**
 * Filter changes on a dashboard (company, period) re-render the same page, which the route progress bar ignores.
 * Filters start their navigation through this transition, so the page can show it's loading while the old
 * numbers stay on screen instead of the page looking frozen.
 */
export function DashboardTransitionProvider({ children }: { children: React.ReactNode }) {
  const [pending, start] = useTransition();
  return <DashboardTransitionContext.Provider value={{ pending, start }}>{children}</DashboardTransitionContext.Provider>;
}

export const useDashboardTransition = () => useContext(DashboardTransitionContext);

/** Dims its content and shows the top progress bar while a filter change loads. */
export function DashboardPending({ children, className }: { children: React.ReactNode; className?: string }) {
  const { pending } = useDashboardTransition();
  return (
    <div aria-busy={pending} className={cn("transition-opacity duration-200", pending && "pointer-events-none opacity-55", className)}>
      {pending && (
        <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5">
          <div className="animate-route-progress h-full origin-left bg-primary shadow-[0_0_8px_var(--primary)]" />
        </div>
      )}
      {children}
    </div>
  );
}
