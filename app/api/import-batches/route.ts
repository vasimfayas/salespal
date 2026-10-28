import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/scoping";

/** Starts a bulk import: the clients created under the returned id can be reversed from the Control Panel. */
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasRole(token, [1, 2, 3])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const orgId = Number(body.org_id) || null;
  const [org, user] = await Promise.all([
    orgId ? prisma.organization.findUnique({ where: { id: orgId }, select: { name: true } }) : null,
    prisma.user.findUnique({ where: { id: Number(token.id) }, select: { name: true } }),
  ]);
  const batch = await prisma.importBatch.create({
    data: {
      file_name: typeof body.file_name === "string" ? body.file_name.slice(0, 200) : null,
      total_rows: Math.max(0, Number(body.total_rows) || 0),
      org_id: org ? orgId : null,
      org_name: org?.name ?? null,
      created_by_id: Number(token.id),
      created_by_name: user?.name ?? "Unknown",
    },
    select: { id: true },
  });
  return NextResponse.json({ id: batch.id }, { status: 201 });
}
