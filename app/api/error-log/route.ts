import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { logError } from "@/lib/error-log";
import { allowAttempt } from "@/lib/rate-limit";

/** Errors caught in the browser (error boundaries) report here; signed-in users only, rate limited. */
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!allowAttempt(`error-log:${token.id}`, 20, 60_000)) return NextResponse.json({ error: "Too many reports" }, { status: 429 });

  const body = await request.json().catch(() => ({}));
  const text = (v: unknown) => (typeof v === "string" ? v : undefined);
  await logError({ source: "client", message: text(body.message) ?? "Unknown error", stack: text(body.stack), path: text(body.path), digest: text(body.digest), userId: Number(token.id) });
  return NextResponse.json({ ok: true });
}
