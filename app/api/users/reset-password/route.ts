import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { allowAttempt } from "@/lib/rate-limit";
import { MIN_PASSWORD_LENGTH } from "@/lib/roles";

/** Signed-in user changes their own password; the current one is required so an open session can't take the account over. */
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!allowAttempt(`password-change:${token.id}`, 5, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const current = typeof body.current_password === "string" ? body.current_password : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(token.id) }, select: { password: true } });
    if (!user || !current || !(await bcrypt.compare(current, user.password))) {
      return NextResponse.json({ error: "Your current password is incorrect" }, { status: 400 });
    }
    if (await bcrypt.compare(password, user.password)) {
      return NextResponse.json({ error: "Choose a password different from the current one" }, { status: 400 });
    }
    await prisma.user.update({ where: { id: Number(token.id) }, data: { password: await bcrypt.hash(password, 10) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password change failed:", error);
    return NextResponse.json({ error: "Couldn't change the password. Try again." }, { status: 500 });
  }
}
