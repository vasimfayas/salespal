import { prisma } from "@/lib/prisma";

/** Extra contacts accepted with a new client. */
export const MAX_EXTRA_CONTACTS = 10;

export type ClientContactItem = { id: number; name: string; designation: string | null; phone: string | null; email: string | null };

/** Contact fields from a form body, or an error message. Name plus a phone or an email. */
export function parseContact(body: Record<string, unknown>) {
  const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const name = text(body.name, 120);
  const designation = text(body.designation, 120) || null;
  const phone = text(body.phone, 40) || null;
  const email = text(body.email, 254) || null;
  if (!name) return { error: "Enter the contact's name" } as const;
  if (!phone && !email) return { error: "Add a phone number or an email" } as const;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address" } as const;
  return { data: { name, designation, phone, email } } as const;
}

/** A client's extra contacts, oldest first. The caller has already checked access to the client. */
export function getClientContacts(clientId: number): Promise<ClientContactItem[]> {
  return prisma.clientContact.findMany({
    where: { client_id: clientId },
    orderBy: { id: "asc" },
    select: { id: true, name: true, designation: true, phone: true, email: true },
  });
}
