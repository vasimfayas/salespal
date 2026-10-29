import { prisma } from "@/lib/prisma";
import { SEED_LOCATIONS, placeSearch, type Place } from "@/lib/locations";

/** Owner and super admin edit the master list of places; everyone else only picks from it. */
export const LOCATION_EDITOR_ROLES = [1, 6];

/** Every location, filling the table from the built-in list the first time it is empty. Country, then kind, then name. */
export async function getLocations(): Promise<Place[]> {
  if ((await prisma.location.count()) === 0) {
    await prisma.location.createMany({
      data: SEED_LOCATIONS.map((l) => ({ name: l.name, code: l.code ?? null, kind: l.kind, country: l.country, country_code: l.countryCode, aliases: l.aliases ?? [] })),
      skipDuplicates: true,
    });
  }
  const rows = await prisma.location.findMany({ orderBy: [{ country: "asc" }, { kind: "asc" }, { name: "asc" }] });
  return rows.map((r) => {
    const l = { name: r.name, code: r.code ?? undefined, kind: r.kind as Place["kind"], country: r.country, countryCode: r.country_code, aliases: r.aliases };
    return { ...l, id: r.id, search: placeSearch(l) };
  });
}

const KINDS = ["port", "airport", "land"];

/** Location fields from a form body, or an error message. */
export function parseLocation(body: Record<string, unknown>) {
  const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const name = text(body.name, 120);
  const country = text(body.country, 80);
  const country_code = text(body.country_code, 3).toUpperCase();
  const kind = text(body.kind, 10);
  if (!name) return { error: "Name is required" } as const;
  if (!KINDS.includes(kind)) return { error: "Choose seaport, airport or road point" } as const;
  if (!country) return { error: "Country is required" } as const;
  if (!/^[A-Z]{2,3}$/.test(country_code)) return { error: "Enter the country's 2-letter code, e.g. QA" } as const;
  const aliases = (Array.isArray(body.aliases) ? body.aliases : []).map((a) => text(a, 60)).filter(Boolean).slice(0, 20);
  return { data: { name, code: text(body.code, 12).toUpperCase() || null, kind, country, country_code, aliases } } as const;
}
