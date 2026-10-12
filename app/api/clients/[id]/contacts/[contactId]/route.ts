import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { getTokenUserId, hasRole } from "@/lib/scoping";
import { findScopedClient } from "@/lib/client-documents";
import { parseContact } from "@/lib/client-contacts";

type Params = { params: Promise<{ id: string; contactId: string }> };

async function load(request: NextRequest, context: Params) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !hasRole(token, [1, 2, 3])) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) } as const;
  const { id, contactId } = await context.params;
  const client = await findScopedClient(token, Number(id));
  const contact = client ? await prisma.clientContact.findFirst({ where: { id: Number(contactId), client_id: client.id } }) : null;
  if (!contact) return { error: NextResponse.json({ error: "Contact not found" }, { status: 404 }) } as const;
  return { token, contact } as const;
}

export async function PATCH(request: NextRequest, context: Params) {
  const found = await load(request, context);
  if ("error" in found) return found.error;
  const parsed = parseContact(await request.json().catch(() => ({})));
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const contact = await prisma.clientContact.update({
    where: { id: found.contact.id },
    data: parsed.data,
    select: { id: true, name: true, designation: true, phone: true, email: true },
  });
  return NextResponse.json({ contact });
}

export async function DELETE(request: NextRequest, context: Params) {
  const found = await load(request, context);
  if ("error" in found) return found.error;
  await prisma.$transaction([
    prisma.clientContact.delete({ where: { id: found.contact.id } }),
    prisma.clientLog.create({ data: { client_id: found.contact.client_id, action: `Contact removed: ${found.contact.name}`, done_by: getTokenUserId(found.token) } }),
  ]);
  return NextResponse.json({ ok: true });
}
