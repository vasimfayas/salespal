import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/scoping";
import { LOCATION_EDITOR_ROLES, parseLocation } from "@/lib/locations-db";

type Params = { params: Promise<{ id: string }> };

/** Enquiries and rates keep the place as plain text, so editing or deleting a location never changes them. */
export async function PATCH(request: NextRequest, context: Params) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !hasRole(token, LOCATION_EDITOR_ROLES)) return NextResponse.json({ error: "Only the owner can edit locations" }, { status: 403 });
  const parsed = parseLocation(await request.json().catch(() => ({})));
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  try {
    const { count } = await prisma.location.updateMany({ where: { id: Number((await context.params).id) }, data: parsed.data });
    if (!count) return NextResponse.json({ error: "Location not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "That place already exists for this country" }, { status: 409 });
  }
  revalidatePath("/dashboard", "layout");
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest, context: Params) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !hasRole(token, LOCATION_EDITOR_ROLES)) return NextResponse.json({ error: "Only the owner can delete locations" }, { status: 403 });
  const { count } = await prisma.location.deleteMany({ where: { id: Number((await context.params).id) } });
  if (!count) return NextResponse.json({ error: "Location not found" }, { status: 404 });
  revalidatePath("/dashboard", "layout");
  return NextResponse.json({ ok: true });
}
