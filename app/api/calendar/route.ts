import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getCalendarSummary, getCalendarTasks } from "@/lib/calendar";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_DAYS = 400;

/** Tasks by due date for the calendar, scoped to what the signed-in user may see. ?from=&to= (YYYY-MM-DD), mode=rows|summary, user=<assignee id>. */
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = request.nextUrl.searchParams;
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const span = (Date.parse(to) - Date.parse(from)) / 86_400_000;
  if (!DATE.test(from) || !DATE.test(to) || !(span >= 0 && span <= MAX_DAYS)) return NextResponse.json({ error: "Invalid date range" }, { status: 400 });

  const viewer = { id: Number(token.id), role_id: Number(token.role_id) };
  const assignee = Number(params.get("user")) || undefined;
  if (params.get("mode") === "summary") return NextResponse.json({ days: await getCalendarSummary(viewer, from, to, assignee) });
  return NextResponse.json(await getCalendarTasks(viewer, from, to, assignee));
}
