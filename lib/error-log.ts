import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

/** Rows older than this (and resolved ones older than half of it) are removed by the daily cleanup. */
export const ERROR_KEEP_DAYS = 90;

type Input = {
  source: "server" | "client";
  message: string;
  stack?: string | null;
  path?: string | null;
  method?: string | null;
  digest?: string | null;
  userId?: number | null;
};

const cut = (value: string | null | undefined, max: number) => (value ? value.slice(0, max) : null);

/** Records an error; the same message on the same route counts up one row instead of adding more. Never throws. */
export async function logError(input: Input) {
  try {
    const message = cut(input.message, 1000) ?? "Unknown error";
    // Route without ids / query so /clients/12 and /clients/13 group together.
    const route = (input.path ?? "").split("?")[0].replace(/\d+/g, ":id");
    const fingerprint = createHash("sha1").update(`${input.source}|${message}|${route}`).digest("hex");
    const version = process.env.NEXT_PUBLIC_APP_VERSION ?? null;
    await prisma.errorLog.upsert({
      where: { fingerprint },
      create: { fingerprint, source: input.source, message, stack: cut(input.stack, 8000), path: cut(input.path, 300), method: cut(input.method, 10), digest: cut(input.digest, 100), user_id: input.userId ?? null, version },
      // A resolved error that happens again is open again.
      update: { count: { increment: 1 }, last_seen: new Date(), status: "open", stack: cut(input.stack, 8000), digest: cut(input.digest, 100), user_id: input.userId ?? undefined, version },
    });
  } catch (error) {
    console.error("could not log error", error);
  }
}
