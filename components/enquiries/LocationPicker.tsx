"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { MapPin, Plane, Ship, Truck, X, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { controlBase, labelClass } from "@/components/ui/field-styles";
import { FREIGHT_LOCATIONS, KIND_FOR_MODE, locationLabel, type LocationKind } from "@/lib/locations";
import { cn } from "@/lib/utils";

const KIND: Record<LocationKind, { icon: LucideIcon; label: string; tone: string }> = {
  port: { icon: Ship, label: "Seaport", tone: "bg-info-soft text-info-foreground" },
  airport: { icon: Plane, label: "Airport", tone: "bg-primary-soft text-primary-soft-foreground" },
  land: { icon: Truck, label: "Road", tone: "bg-warning-soft text-warning-foreground" },
};

const MAX_RESULTS = 80;

/**
 * Searchable From / To field. Suggests ports, airports and road points grouped by country, with the
 * kind that suits the transport mode listed first. The value is plain text, so anything can still be typed.
 */
export function LocationPicker({
  id,
  label,
  value,
  onChange,
  mode,
  required,
  placeholder,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** sea | air | land — decides which kind of place is suggested first. */
  mode: string;
  required?: boolean;
  placeholder?: string;
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const listId = `${inputId}-list`;
  const [open, setOpen] = useState(false);
  // Filter only by what the person typed since opening; a picked value shows the full list again.
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const preferred = KIND_FOR_MODE[mode] ?? "port";

  const groups = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/[\s,]+/).filter(Boolean);
    const matches = FREIGHT_LOCATIONS.filter((l) =>
      tokens.length ? tokens.every((t) => l.search.includes(t)) : l.kind === preferred,
    )
      // Preferred kind first, then the list's own order (Gulf first).
      .map((l, i) => ({ l, rank: (l.kind === preferred ? 0 : 1) * 10000 + i }))
      .sort((a, b) => a.rank - b.rank)
      .slice(0, MAX_RESULTS)
      .map((x) => x.l);
    const byCountry = new Map<string, typeof matches>();
    for (const m of matches) byCountry.set(m.country, [...(byCountry.get(m.country) ?? []), m]);
    return [...byCountry.entries()].map(([country, items]) => ({ country, code: items[0].countryCode, items }));
  }, [query, preferred]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const typed = query.trim();
  const exact = flat.some((l) => locationLabel(l).toLowerCase() === typed.toLowerCase());

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function choose(index: number) {
    const l = flat[index];
    if (!l) return;
    onChange(locationLabel(l));
    setQuery("");
    setOpen(false);
  }

  let optionIndex = -1;
  return (
    <div ref={boxRef} className="relative">
      <label htmlFor={inputId} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && flat[active] ? `${listId}-${active}` : undefined}
          autoComplete="off"
          required={required}
          value={value}
          placeholder={placeholder ?? "Search port, airport, city or country"}
          onFocus={() => {
            setQuery("");
            setActive(0);
            setOpen(true);
          }}
          onChange={(e) => {
            onChange(e.target.value);
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((a) => Math.min(a + 1, flat.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && open && flat[active]) {
              e.preventDefault();
              choose(active);
            } else if (e.key === "Escape" && open) {
              e.stopPropagation(); // close the list, not the surrounding dialog
              setOpen(false);
            } else if (e.key === "Tab") {
              setOpen(false);
            }
          }}
          className={cn(controlBase, "h-10 pl-9 pr-9")}
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Clear ${label}`}
            onClick={() => {
              onChange("");
              setQuery("");
              setOpen(true);
            }}
            className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
          >
            <X />
          </Button>
        )}
      </div>

      {open && (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={`${label} suggestions`}
          className="animate-pop-in absolute z-30 mt-1 max-h-80 w-full min-w-72 overflow-y-auto rounded-control border border-border bg-popover py-1 text-sm shadow-pop"
        >
          {!typed && (
            <p className="px-3 pb-1 pt-1.5 text-xs text-muted-foreground">
              {KIND[preferred].label}s for this mode. Type to search everything.
            </p>
          )}
          {groups.map((g) => (
            <div key={g.country} role="group" aria-label={g.country}>
              <div className="sticky top-0 z-10 flex items-center gap-2 bg-popover/95 px-3 pb-1 pt-2 text-xs font-semibold text-foreground backdrop-blur">
                <span className="rounded bg-muted px-1 py-px font-mono text-[10px] font-medium text-muted-foreground">{g.code}</span>
                {g.country}
              </div>
              {g.items.map((l) => {
                optionIndex += 1;
                const i = optionIndex;
                const k = KIND[l.kind];
                const Icon = k.icon;
                return (
                  <div
                    key={`${l.kind}-${l.name}`}
                    id={`${listId}-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={i === active}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(i)}
                    onMouseEnter={() => setActive(i)}
                    className={cn("mx-1 flex cursor-pointer items-center gap-2.5 rounded-md py-1.5 pl-4 pr-2", i === active && "bg-muted")}
                  >
                    <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-md", k.tone)} title={k.label}>
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-foreground">{l.name}</span>
                    {l.code && <span className="shrink-0 font-mono text-xs text-muted-foreground">{l.code}</span>}
                    <span className="sr-only">{k.label}</span>
                  </div>
                );
              })}
            </div>
          ))}
          {flat.length === 0 && <p className="px-3 py-2 text-sm text-muted-foreground">No listed port or airport matches.</p>}
          {typed && !exact && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setOpen(false)}
              className="mx-1 mt-1 flex w-[calc(100%-0.5rem)] cursor-pointer items-center gap-2 rounded-md border-t border-border px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted"
            >
              <span className="min-w-0 truncate">
                Use <span className="font-medium text-foreground">“{typed}”</span> as typed
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
