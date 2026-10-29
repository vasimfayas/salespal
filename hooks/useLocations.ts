"use client";

import { useEffect, useState } from "react";
import type { Place } from "@/lib/locations";

let cache: Place[] | null = null;
let pending: Promise<Place[]> | null = null;

/** Forget the loaded list (after the Locations page changes it). */
export const resetLocations = () => {
  cache = null;
  pending = null;
};

/** The master list of ports, airports and road points, fetched once per page load and shared by every picker. null while loading. */
export function useLocations(): Place[] | null {
  const [list, setList] = useState<Place[] | null>(cache);
  useEffect(() => {
    if (cache) return setList(cache);
    pending ??= fetch("/api/locations")
      .then((res) => (res.ok ? res.json() : { locations: [] }))
      .then((d) => (cache = d.locations ?? []))
      .catch(() => (pending = null, []));
    let live = true;
    pending.then((l) => live && setList(l));
    return () => {
      live = false;
    };
  }, []);
  return list;
}
