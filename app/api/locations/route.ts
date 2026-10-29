import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/scoping";
import { LOCATION_EDITOR_ROLES, getLocations, parseLocation } from "@/lib/locations-db";

/** Every signed-in user: the places the From / To pickers suggest. */
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ locations: await getLocations() });
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !hasRole(token, LOCATION_EDITOR_ROLES)) return NextResponse.json({ error: "Only the owner can add locations" }, { status: 403 });
  const parsed = parseLocation(await request.json().catch(() => ({})));
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  try {
    const location = await prisma.location.create({ data: parsed.data });
    revalidatePath("/dashboard", "layout");
    return NextResponse.json({ id: location.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "That place already exists for this country" }, { status: 409 });
  }
}
