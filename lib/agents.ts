import { orderModes } from "@/types/order";

/** Agent fields from a form body, or an error message. */
export function parseAgent(body: Record<string, unknown>) {
  const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const name = text(body.name, 120);
  const email = text(body.email, 254);
  if (!name) return { error: "Agent name is required" } as const;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address" } as const;
  const modes = Array.isArray(body.modes) ? orderModes.filter((m) => (body.modes as unknown[]).includes(m)) : [];
  return {
    data: { name, email, contact_person: text(body.contact_person, 120) || null, phone: text(body.phone, 40) || null, country: text(body.country, 80) || null, modes },
  } as const;
}

/** Owner and managers manage agents; salesmen only pick them when sending an enquiry. */
export const AGENT_EDITOR_ROLES = [1, 2];

/** Owner, managers and accounts lock / unlock agents. Locked agents can't be sent enquiries. */
export const AGENT_LOCK_ROLES = [1, 2, 4];
