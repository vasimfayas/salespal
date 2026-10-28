import { prisma } from "@/lib/prisma";

/** Adds a deployment row when the server starts on a version / commit it hasn't seen last. Never throws. */
export async function recordDeployment() {
  try {
    const version = process.env.NEXT_PUBLIC_APP_VERSION;
    if (!version) return;
    const commit = process.env.NEXT_PUBLIC_COMMIT || null;
    const latest = await prisma.deployment.findFirst({ orderBy: { id: "desc" }, select: { version: true, commit: true } });
    if (latest && latest.version === version && latest.commit === commit) return;
    await prisma.deployment.create({ data: { version, commit } });
  } catch (error) {
    console.error("could not record deployment", error);
  }
}
