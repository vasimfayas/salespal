import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { groupStatusCounts } from "@/lib/kpi";
import { getPerformance, monthPeriod } from "@/lib/performance";
import { canAccessSalesman } from "@/lib/scoping";

export async function GET(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = await context.params;
  const salesmanId = Number(userId);
  if (!(await canAccessSalesman(token, salesmanId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Performance this month (orders, order value, new clients) + client counts by status.
  const [clients, perf] = await Promise.all([
    prisma.client.findMany({ where: { assigned_salesman_id: salesmanId }, select: { status: true } }),
    getPerformance([salesmanId], monthPeriod(0)),
  ]);
  return NextResponse.json({ performance: perf.get(salesmanId), counts: groupStatusCounts(clients) });
}
