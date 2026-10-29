"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Pencil, Plus, Plane, RotateCcw, Ship, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { labelClass } from "@/components/ui/field-styles";
import { resetLocations } from "@/hooks/useLocations";
import type { LocationKind, Place } from "@/lib/locations";
import { cn } from "@/lib/utils";

const KINDS: { value: LocationKind; label: string; icon: typeof Ship }[] = [
  { value: "port", label: "Seaport", icon: Ship },
  { value: "airport", label: "Airport", icon: Plane },
  { value: "land", label: "Road point", icon: Truck },
];
const PAGE_SIZE = 50;
const EMPTY = { name: "", code: "", kind: "port" as LocationKind, country: "", country_code: "", aliases: "" };
const selectClass =
  "h-9 cursor-pointer rounded-control border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none hover:border-border-strong focus:border-ring focus:ring-3 focus:ring-ring/15";

/** The master list of places: search, filter by kind / country, add, edit and delete. Enquiries keep places as text, so edits never change them. */
export function LocationsClient({ locations }: { locations: Place[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [country, setCountry] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Place | "new" | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countries = useMemo(() => [...new Set(locations.map((l) => l.country))].sort(), [locations]);
  const filtered = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return locations.filter((l) => (kind === "all" || l.kind === kind) && (country === "all" || l.country === country) && tokens.every((t) => l.search.includes(t)));
  }, [locations, query, kind, country]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const filtering = query || kind !== "all" || country !== "all";

  function open(l: Place | "new") {
    setEditing(l);
    setError(null);
    setForm(l === "new" ? { ...EMPTY, country: country !== "all" ? country : "", country_code: country !== "all" ? locations.find((x) => x.country === country)?.countryCode ?? "" : "" } : { name: l.name, code: l.code ?? "", kind: l.kind, country: l.country, country_code: l.countryCode, aliases: (l.aliases ?? []).join(", ") });
  }

  async function changed(message: string) {
    toast.success(message);
    resetLocations();
    router.refresh();
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(editing === "new" ? "/api/locations" : `/api/locations/${(editing as Place).id}`, {
        method: editing === "new" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, aliases: form.aliases.split(",") }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't save the location");
      setEditing(null);
      await changed(editing === "new" ? "Location added" : "Location updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save the location");
    } finally {
      setSaving(false);
    }
  }

  async function remove(l: Place) {
    if (!confirm(`Delete ${l.name}, ${l.country}? Existing enquiries and rates keep their text.`)) return;
    const res = await fetch(`/api/locations/${l.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(data.error || "Couldn't delete the location");
    await changed("Location deleted");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-card border border-border bg-card p-3 shadow-card">
        <input
          type="search"
          aria-label="Search locations"
          value={query}
          onChange={(e) => (setQuery(e.target.value), setPage(1))}
          placeholder="Search name, code, city or country…"
          className="h-9 min-w-48 flex-1 rounded-control border border-input bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/15"
        />
        <select aria-label="Filter by type" value={kind} onChange={(e) => (setKind(e.target.value), setPage(1))} className={selectClass}>
          <option value="all">All types</option>
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}s
            </option>
          ))}
        </select>
        <select aria-label="Filter by country" value={country} onChange={(e) => (setCountry(e.target.value), setPage(1))} className={selectClass}>
          <option value="all">All countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {filtering && (
          <Button size="sm" variant="ghost" onClick={() => (setQuery(""), setKind("all"), setCountry("all"), setPage(1))}>
            <RotateCcw /> Reset
          </Button>
        )}
        <Button size="sm" onClick={() => open("new")} className="ml-auto">
          <Plus /> Add location
        </Button>
      </div>

      {shown.length === 0 ? (
        <EmptyState icon={MapPin} title="No locations match" message="Try a different search or filter, or add the place." />
      ) : (
        <div className="overflow-x-auto rounded-card border border-border bg-card shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Type</th>
                <th className="px-4 py-2.5 font-medium">Code</th>
                <th className="px-4 py-2.5 font-medium">Country</th>
                <th className="hidden px-4 py-2.5 font-medium md:table-cell">Also searched as</th>
                <th className="px-4 py-2.5"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shown.map((l) => {
                const k = KINDS.find((x) => x.value === l.kind)!;
                return (
                  <tr key={l.id} className="hover:bg-muted/40">
                    <td className="px-4 py-2 font-medium text-foreground">{l.name}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <k.icon size={14} aria-hidden /> {k.label}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{l.code ?? "—"}</td>
                    <td className="px-4 py-2 text-foreground">
                      {l.country} <span className="font-mono text-[10px] text-muted-foreground">{l.countryCode}</span>
                    </td>
                    <td className="hidden max-w-xs truncate px-4 py-2 text-xs text-muted-foreground md:table-cell">{l.aliases?.join(", ")}</td>
                    <td className="px-4 py-2">
                      <div className="flex justify-end">
                        <Button variant="ghost" size="icon-sm" onClick={() => open(l)} aria-label={`Edit ${l.name}`} title="Edit">
                          <Pencil />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => remove(l)} aria-label={`Delete ${l.name}`} title="Delete" className="hover:bg-danger-soft hover:text-danger-foreground">
                          <Trash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground" aria-live="polite">
        <span>
          {filtered.length} of {locations.length} locations
        </span>
        {pages > 1 && (
          <span className="flex items-center gap-2">
            <Button size="sm" variant="secondary" disabled={current === 1} onClick={() => setPage(current - 1)}>
              Prev
            </Button>
            Page {current} / {pages}
            <Button size="sm" variant="secondary" disabled={current === pages} onClick={() => setPage(current + 1)}>
              Next
            </Button>
          </span>
        )}
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)}>
        <form onSubmit={save} className="space-y-4">
          <ModalHeader title={editing === "new" ? "Add location" : "Edit location"} onClose={() => setEditing(null)} />
          {error && (
            <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm font-medium text-danger-foreground">
              {error}
            </p>
          )}
          <fieldset>
            <legend className={labelClass}>Type</legend>
            <div className="flex flex-wrap gap-2">
              {KINDS.map((k) => (
                <label
                  key={k.value}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-2 rounded-control border px-3 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                    form.kind === k.value ? "border-primary bg-primary-soft text-primary-soft-foreground" : "border-border text-foreground hover:bg-muted",
                  )}
                >
                  <input type="radio" name="kind" className="sr-only" checked={form.kind === k.value} onChange={() => setForm({ ...form, kind: k.value })} />
                  <k.icon size={14} aria-hidden /> {k.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
            <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ningbo" />
            <Input label={form.kind === "airport" ? "IATA code" : "Code (optional)"} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder={form.kind === "airport" ? "e.g. NGB" : "e.g. CNNGB"} />
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
            <Input label="Country" required list="location-countries" autoComplete="off" value={form.country} onChange={(e) => {
              const known = locations.find((l) => l.country.toLowerCase() === e.target.value.trim().toLowerCase());
              setForm({ ...form, country: e.target.value, country_code: known?.countryCode ?? form.country_code });
            }} placeholder="e.g. China" />
            <Input label="Country code" required maxLength={3} value={form.country_code} onChange={(e) => setForm({ ...form, country_code: e.target.value.toUpperCase() })} placeholder="CN" />
          </div>
          <datalist id="location-countries">
            {countries.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <Input label="Also searched as (optional)" value={form.aliases} onChange={(e) => setForm({ ...form, aliases: e.target.value })} hint="Comma-separated: other names, the city, abbreviations." />
          <ModalFooter>
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing === "new" ? "Add location" : "Save"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
