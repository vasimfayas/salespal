"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSalesPalSession } from "@/lib/auth";
import { SUPER_ADMIN_ROLE } from "@/lib/roles";

type Result<T = object> = ({ success: true } & T) | { success: false; error: string };

async function verifySuperAdmin() {
  const session = await getSalesPalSession();
  if (session?.user.role_id !== SUPER_ADMIN_ROLE) throw new Error("Unauthorized");
  return { id: Number(session.user.id), name: session.user.name ?? "Super admin" };
}

const refresh = () => revalidatePath("/dashboard/admin/control-panel");

/**
 * Undoes a bulk import: removes the clients it created that are still untouched. Clients that have enquiries, orders,
 * approval requests or departments are kept (they hold business records) and counted, so a later re-run or a manual
 * cleanup is possible. Their history, contacts and documents rows go with the client.
 */
export async function reverseImportBatch(id: number): Promise<Result<{ removed: number; kept: number }>> {
  const admin = await verifySuperAdmin();
  const batch = await prisma.importBatch.findUnique({ where: { id }, select: { status: true } });
  if (!batch) return { success: false, error: "Import not found." };
  if (batch.status === "importing") return { success: false, error: "This import is still running." };
  if (batch.status === "reversed") return { success: false, error: "This import was already reversed." };

  const untouched = { import_batch_id: id, enquiries: { none: {} }, orders: { none: {} }, approvalRequests: { none: {} }, departments: { none: {} } };
  const removable = await prisma.client.findMany({ where: untouched, select: { id: true } });
  const ids = removable.map((c) => c.id);
  const kept = await prisma.client.count({ where: { import_batch_id: id, id: { notIn: ids } } });

  await prisma.$transaction([
    prisma.client.deleteMany({ where: { id: { in: ids } } }),
    prisma.importBatch.update({
      where: { id },
      data: { status: kept ? "partially_reversed" : "reversed", reversed_at: new Date(), reversed_by: admin.name, reversed_count: { increment: ids.length }, kept_count: kept },
    }),
  ]);
  for (const tag of ["salesman-dashboard", "salesman-clients", "admin-clients", "admin-companies", "manager-dashboard", "manager-clients"]) revalidateTag(tag, { expire: 0 });
  refresh();
  return { success: true, removed: ids.length, kept };
}

export async function setErrorStatus(id: number, status: "open" | "resolved"): Promise<Result> {
  await verifySuperAdmin();
  await prisma.errorLog.update({ where: { id }, data: { status } });
  refresh();
  return { success: true };
}

/** Marks every open error resolved (after a fix is deployed); they reopen by themselves if they happen again. */
export async function resolveAllErrors(): Promise<Result<{ count: number }>> {
  await verifySuperAdmin();
  const { count } = await prisma.errorLog.updateMany({ where: { status: "open" }, data: { status: "resolved" } });
  refresh();
  return { success: true, count };
}

export async function setDeploymentNote(id: number, note: string): Promise<Result> {
  await verifySuperAdmin();
  await prisma.deployment.update({ where: { id }, data: { note: note.trim().slice(0, 500) || null } });
  refresh();
  return { success: true };
}
