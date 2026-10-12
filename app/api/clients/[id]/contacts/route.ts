import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { getTokenUserId, hasRole } from "@/lib/scoping";
import { findScopedClient } from "@/lib/client-documents";
import { parseContact } from "@/lib/client-contacts";

/** Add a contact person to a client (anyone who can see the client: salesman, manager, owner). */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !hasRole(token, [1, 2, 3])) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const client = await findScopedClient(token, Number((await context.params).id));
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const parsed = parseContact(await request.json().catch(() => ({})));
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const userId = getTokenUserId(token);
  const contact = await prisma.$transaction(async (tx) => {
    const created = await tx.clientContact.create({
      data: { client_id: client.id, ...parsed.data, created_by_id: userId },
      select: { id: true, name: true, designation: true, phone: true, email: true },
    });
    await tx.clientLog.create({
      data: { client_id: client.id, action: `Contact added: ${created.name}${created.designation ? ` (${created.designation})` : ""}`, done_by: userId },
    });
    return created;
  });
  return NextResponse.json({ contact }, { status: 201 });
}
