"use server";

import bcrypt from "bcryptjs";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSalesPalSession } from "@/lib/auth";
import { DEFAULT_PASSWORD, isOwnerRole, SUPER_ADMIN_ROLE } from "@/lib/roles";

type Result = { success: true } | { success: false; error: string };

/** Owner and super admin manage users; only the super admin manages owner / super admin accounts. */
async function verifyUserAdmin() {
  const session = await getSalesPalSession();
  if (!session || !isOwnerRole(session.user.role_id)) throw new Error("Unauthorized");
  return { id: Number(session.user.id), isSuper: session.user.role_id === SUPER_ADMIN_ROLE };
}

const canManageRole = (roleId: number, isSuper: boolean) => (isOwnerRole(roleId) ? isSuper : roleId >= 2 && roleId <= 5);

function parseUser(data: { name?: unknown; email?: unknown; phone?: unknown; password?: unknown }, passwordRequired: boolean) {
  const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const name = text(data.name, 120);
  const email = text(data.email, 254).toLowerCase();
  const password = typeof data.password === "string" ? data.password : "";
  if (!name) return { error: "Name is required" } as const;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address" } as const;
  if ((passwordRequired || password) && password.length < 6) return { error: "Password must be at least 6 characters" } as const;
  return { name, email, phone: text(data.phone, 40) || null, password } as const;
}

function revalidateUsers() {
  revalidatePath("/dashboard", "layout");
  revalidateTag("admin-companies", { expire: 0 });
}

export async function createUser(data: { name: string; email: string; phone?: string; role_id: number; password?: string }): Promise<Result> {
  const admin = await verifyUserAdmin();
  if (!canManageRole(data.role_id, admin.isSuper)) return { success: false, error: "You can't create users with that role." };
  const parsed = parseUser({ ...data, password: data.password || DEFAULT_PASSWORD }, true);
  if ("error" in parsed) return { success: false, error: parsed.error! };
  if (await prisma.user.findUnique({ where: { email: parsed.email }, select: { id: true } })) {
    return { success: false, error: "A user with this email already exists." };
  }
  await prisma.user.create({
    data: { name: parsed.name, email: parsed.email, phone: parsed.phone, role_id: data.role_id, password: await bcrypt.hash(parsed.password, 10) },
  });
  revalidateUsers();
  return { success: true };
}

/** Name, email, phone and (optionally) a new password. The role is fixed: it ties the user to companies, teams and records. */
export async function updateUser(id: number, data: { name: string; email: string; phone?: string; password?: string }): Promise<Result> {
  const admin = await verifyUserAdmin();
  const user = await prisma.user.findUnique({ where: { id }, select: { role_id: true } });
  if (!user) return { success: false, error: "User not found." };
  if (!canManageRole(user.role_id, admin.isSuper) && id !== admin.id) return { success: false, error: "You can't edit this user." };
  const parsed = parseUser(data, false);
  if ("error" in parsed) return { success: false, error: parsed.error! };
  if (await prisma.user.findFirst({ where: { email: parsed.email, id: { not: id } }, select: { id: true } })) {
    return { success: false, error: "Another user already has this email." };
  }
  await prisma.user.update({
    where: { id },
    data: { name: parsed.name, email: parsed.email, phone: parsed.phone, ...(parsed.password ? { password: await bcrypt.hash(parsed.password, 10) } : {}) },
  });
  revalidateUsers();
  return { success: true };
}

/** Only users with no work on record can be deleted, so history (and cascaded targets / tasks) is never lost. */
export async function deleteUser(id: number): Promise<Result> {
  const admin = await verifyUserAdmin();
  if (id === admin.id) return { success: false, error: "You can't delete your own account." };
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      name: true,
      role_id: true,
      _count: {
        select: {
          assignedClients: true,
          createdEnquiries: true,
          createdOrders: true,
          assignedTasks: true,
          createdTasks: true,
          clientLogs: true,
          recordedPayments: true,
          enquiryEvents: true,
          enquiryFollowUps: true,
          updatedShippingRates: true,
          salesmanTargets: true,
          assignedTargets: true,
          uploadedClientDocuments: true,
          uploadedCompanyDocuments: true,
          agentRequestsSent: true,
          cancelledEnquiries: true,
          taskUpdates: true,
          kpiLogs: true,
          assignedClientTasks: true,
          createdClientTasks: true,
        },
      },
    },
  });
  if (!user) return { success: false, error: "User not found." };
  if (!canManageRole(user.role_id, admin.isSuper)) return { success: false, error: "You can't delete this user." };

  const c = user._count;
  const work: [number, string, string][] = [
    [c.assignedClients, "client", "clients"],
    [c.createdEnquiries, "enquiry", "enquiries"],
    [c.createdOrders, "order", "orders"],
    [c.assignedTasks + c.createdTasks + c.assignedClientTasks + c.createdClientTasks, "task", "tasks"],
    [c.recordedPayments, "payment", "payments"],
    [c.salesmanTargets + c.assignedTargets, "target", "targets"],
  ];
  const listed = work.filter(([n]) => n > 0).map(([n, one, many]) => `${n} ${n === 1 ? one : many}`);
  const total = Object.values(c).reduce((a, b) => a + b, 0);
  if (total > 0) {
    return {
      success: false,
      error: `${user.name} can't be deleted: they have ${listed.length ? listed.join(", ") : "activity"} on record. Reassign their clients first, or keep the account.`,
    };
  }
  await prisma.user.delete({ where: { id } });
  revalidateUsers();
  return { success: true };
}
