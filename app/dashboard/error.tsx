"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // Tell the Control Panel's error log; a failed report must never make this screen worse.
  useEffect(() => {
    fetch("/api/error-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: error.message, stack: error.stack, digest: error.digest, path: window.location.pathname }),
    }).catch(() => {});
  }, [error]);

  return (
    <div className="rounded-lg border border-danger/30 bg-danger-soft p-6">
      <h2 className="text-lg font-semibold text-danger-foreground">Something went wrong</h2>
      <p className="mt-1 text-sm text-danger-foreground">The dashboard could not load.</p>
      <Button className="mt-4" onClick={reset}>Try again</Button>
    </div>
  );
}
