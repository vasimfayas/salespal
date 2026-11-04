import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/scoping";
import { enquiryScopeWhere, revalidateEnquiryPages } from "@/lib/enquiries";
import { isEnquiryPriority } from "@/types/enquiry";

/**
 * Sets an enquiry's priority flag. Body: priority (0 normal, 1 medium, 2 very important).
 * The salesman who raised it, their manager and the owner / super admin (enquiry scope); accounts / operations only see it.
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasRole(token, [1, 2, 3])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  if (!isEnquiryPriority(body.priority)) return NextResponse.json({ error: "Pick a priority" }, { status: 400 });

  const enquiry = await prisma.enquiry.findFirst({ where: { AND: [{ id: Number(id) }, await enquiryScopeWhere(token)] }, select: { id: true } });
  if (!enquiry) return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });

  await prisma.enquiry.update({ where: { id: enquiry.id }, data: { priority: body.priority } });
  revalidateEnquiryPages();
  return NextResponse.json({ priority: body.priority });
}
