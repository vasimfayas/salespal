import { orderModes } from "@/types/order";

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
    },
  } as const;
}

/** Owner and managers manage agents; salesmen only pick them when sending an enquiry. */
export const AGENT_EDITOR_ROLES = [1, 2];

/** Owner, managers and accounts lock / unlock agents. Locked agents can't be sent enquiries. */
export const AGENT_LOCK_ROLES = [1, 2, 4];
