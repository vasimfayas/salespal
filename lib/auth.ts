import type { NextAuthOptions, Session } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { allowAttempt, clearAttempts, clientIp } from "@/lib/rate-limit";

/** Sign-in lasts 8 hours; role changes and removed users are picked up every 5 minutes. */
const SESSION_MAX_AGE = 8 * 60 * 60;
const REFRESH_MS = 5 * 60 * 1000;
const MAX_FAILED_LOGINS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) return null;
        // Every attempt counts, per email and per IP; a correct password clears the email's count.
        const email = credentials.email.trim().toLowerCase();
        const emailKey = `login:email:${email}`;
        if (!allowAttempt(emailKey, MAX_FAILED_LOGINS, LOGIN_WINDOW_MS) || !allowAttempt(`login:ip:${clientIp(req.headers ?? {})}`, MAX_FAILED_LOGINS * 6, LOGIN_WINDOW_MS)) {
          throw new Error("Too many sign-in attempts. Try again in 15 minutes.");
        }

        const user = await prisma.user.findUnique({
          // Same normalising as when users are created (pasted / autofilled emails often carry spaces).
          where: { email },
          include: { managerOrgs: true, salesmanManager: true },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        clearAttempts(emailKey);
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role_id: user.role_id,
          org_ids: user.managerOrgs.map((item) => item.org_id),
          manager_ids: [...new Set(user.salesmanManager.map((item) => item.manager_id))],
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.role_id = user.role_id;
        token.org_ids = user.org_ids ?? [];
        token.manager_ids = user.manager_ids ?? [];
        token.checked_at = Date.now();
      } else if (Date.now() - Number(token.checked_at ?? 0) > REFRESH_MS) {
        // Pick up role changes and removed users without a new sign-in; no role (0) locks them out.
        const current = await prisma.user.findUnique({ where: { id: Number(token.id) }, select: { role_id: true } });
        token.role_id = current?.role_id ?? 0;
        token.checked_at = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = Number(token.id);
        session.user.role_id = Number(token.role_id);
        session.user.org_ids = (token.org_ids as number[]) ?? [];
        session.user.manager_ids = (token.manager_ids as number[]) ?? [];
      }
      return session;
    },
  },
};

export function getSalesPalSession() {
  return getServerSession(authOptions) as Promise<Session | null>;
}
