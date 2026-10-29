import { orderModes } from "@/types/order";
import type { Place } from "@/lib/locations";

/** Agent fields from a form body, or an error message. */
export function parseAgent(body: Record<string, unknown>) {
  const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const list = (v: unknown, max: number) => (Array.isArray(v) ? v.map((x) => text(x, max)).filter(Boolean).slice(0, 10) : []);
  const name = text(body.name, 120);
  const emails = [text(body.email, 254), ...list(body.extra_emails, 254)].filter(Boolean);
  if (!name) return { error: "Agent name is required" } as const;
  const bad = emails.find((e) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  if (!emails.length || bad) return { error: `Enter a valid email address${bad ? `: ${bad}` : ""}` } as const;
  const modes = Array.isArray(body.modes) ? orderModes.filter((m) => (body.modes as unknown[]).includes(m)) : [];
  return {
    data: {
      name,
      email: emails[0],
      extra_emails: emails.slice(1),
      contact_person: text(body.contact_person, 120) || null,
      phone: text(body.phone, 40) || null,
      extra_phones: list(body.extra_phones, 40),
      country: text(body.country, 80) || null,
      network: text(body.network, 80) || null,
      code: text(body.code, 40) || null,
      modes,
      is_top: body.is_top === true,
    },
  } as const;
}

/** Owner and managers manage agents; salesmen only pick them when sending an enquiry. */
export const AGENT_EDITOR_ROLES = [1, 2];

/** Owner, managers and accounts lock / unlock agents. Locked agents can't be sent enquiries. */
export const AGENT_LOCK_ROLES = [1, 2, 4];

/**
 * The country of an enquiry's From / To: the end of a label like "Ningbo, China", otherwise looked up in the master list
 * of places ("Karachi", "London (LHR)"). Lower-cased; "" when unknown.
 */
export function placeCountry(place: string, places: Place[]) {
  if (place.includes(",")) return place.split(",").pop()!.trim().toLowerCase();
  const name = place.replace(/\(.*?\)/g, "").trim().toLowerCase();
  const code = place.match(/\(([A-Za-z]{3,5})\)/)?.[1]?.toLowerCase();
  const hit = places.find((l) => l.name.toLowerCase() === name || (!!code && l.code?.toLowerCase() === code) || l.aliases?.some((x) => x.toLowerCase() === name));
  return hit?.country.toLowerCase() ?? "";
}

/**
 * Agents worth preselecting for an enquiry: they handle its transport mode and are in the country it ships from
 * (sea from Ningbo → sea agents in China). Agents without a country or mode set are never suggested; they can still be searched.
 */
export function agentMatchesRoute(agent: { modes: string[]; country: string | null }, enquiry: { mode: string; from: string }, places: Place[]) {
  if (!agent.country || !agent.modes.includes(enquiry.mode)) return false;
  return placeCountry(enquiry.from, places) === agent.country.trim().toLowerCase();
}
