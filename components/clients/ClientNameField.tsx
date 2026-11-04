"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Building2, Loader2, UserRound } from "lucide-react";
import { Input } from "@/components/ui/Input";

/** A company on file whose name looks like the one typed, as GET /api/clients?name_like= returns it (names only). */
type NameMatch = { id: number; name: string; org_name: string; salesman: string; exact: boolean };
type Lookup = { name: string; matches: NameMatch[] };

/**
 * Client Name on the add-client form: from 3 letters, lists companies already on file with a similar name and who
 * handles them, so a duplicate is spotted before saving. The server refuses an exact name match only without a CR No.
 */
export function ClientNameField({ value, onChange, hasCr }: { value: string; onChange: (value: string) => void; /** A CR No is entered (a new CR = a different company). */ hasCr: boolean }) {
  const name = value.trim().replace(/\s+/g, " ");
  const [lookup, setLookup] = useState<Lookup | null>(null);

  useEffect(() => {
    if (name.length < 3) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/clients?name_like=${encodeURIComponent(name)}`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((data) => setLookup({ name, matches: data.matches ?? [] }))
        .catch(() => {
          if (!controller.signal.aborted) setLookup({ name, matches: [] });
        });
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [name]);

  const current = name.length >= 3 && lookup?.name === name ? lookup : null;
  const checking = name.length >= 3 && !current;
  const matches = current?.matches ?? [];
  const exact = matches.some((m) => m.exact);

  return (
    <div className="space-y-2">
      <Input
        label="Client Name"
        type="text"
        required
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder="e.g. Acme Corp"
        className="text-xs"
      />
      <div aria-live="polite">
        {checking && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 size={12} className="animate-spin" aria-hidden /> Checking similar names…
          </p>
        )}
        {matches.length > 0 && (
          <div className="space-y-2 rounded-lg border border-warning/30 bg-warning-soft/60 p-3 text-xs">
            <p className="flex items-start gap-2 font-medium text-foreground">
              <AlertTriangle size={14} className="mt-px shrink-0 text-warning-foreground" aria-hidden />
              {exact && !hasCr ? "A client with this name is already registered." : "Possible matches already registered:"}
            </p>
            <ul className="space-y-1 border-t border-warning/20 pt-2">
              {matches.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-1.5 text-foreground/85">
                    <Building2 size={12} className="shrink-0 text-muted-foreground" aria-hidden />
                    <span className={m.exact ? "truncate font-semibold" : "truncate"}>{m.name}</span>
                    <span className="shrink-0 text-muted-foreground">· {m.org_name}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
                    <UserRound size={12} aria-hidden />
                    {m.salesman}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground">
              {hasCr
                ? "A different CR number means a different company, so you can still add it."
                : "Different company? Enter its CR number above to add it. Same company? Enter that company's CR number to add your department."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
