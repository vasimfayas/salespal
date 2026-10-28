import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

/** Closes a bulk import with how many rows were rejected. Only the user who started it. */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const { count } = await prisma.importBatch.updateMany({
    where: { id: Number(id), created_by_id: Number(token.id), status: "importing" },
    data: { status: "completed", finished_at: new Date(), failed_rows: Math.max(0, Number(body.failed_rows) || 0) },
  });
  if (!count) return NextResponse.json({ error: "Import not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
