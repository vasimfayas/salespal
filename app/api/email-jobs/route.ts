import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/scoping";

/** Status of queued emails (query: ids=1,2,3), for the dialogs that just sent them. Roles that can send enquiries. */
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !hasRole(token, [2, 3])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const ids = (request.nextUrl.searchParams.get("ids") ?? "").split(",").map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, 50);
  const jobs = await prisma.emailJob.findMany({ where: { id: { in: ids } }, select: { id: true, status: true, error: true } });
  return NextResponse.json({ jobs });
}
