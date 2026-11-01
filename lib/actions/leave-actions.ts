"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSalesPalSession } from "@/lib/auth";
import { isOwnerRole } from "@/lib/roles";
import { getManagerSalesmanIds } from "@/lib/scoping";
import { parseDateOnly, todayUtc } from "@/lib/salesman-targets";
import { leaveDaysTaken, leaveState, type LeaveState } from "@/lib/leave";

type Result = { success: true } | { success: false; error: string };

export type LeaveRow = { id: number; start: string; end: string; returnedAt: string | null; coverName: string; state: LeaveState; days: number };
export type LeaveInfo = {
  user: { id: number; name: string; role_id: number };
  leaves: LeaveRow[];
  totalDays: number;
  /** Who can stand in: same role, sharing a company. */
  candidates: { id: number; name: string }[];
};

const iso = (d: Date) => d.toISOString().slice(0, 10);

/** Owner / super admin: any manager or salesman. Manager: salesmen on their team. */
async function authorize(userId: number) {
  const session = await getSalesPalSession();
  if (!session) return { error: "Unauthorized" } as const;
  const actorId = Number(session.user.id);
  const role = session.user.role_id;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, role_id: true } });
  if (!user || (user.role_id !== 2 && user.role_id !== 3)) return { error: "Only managers and salesmen can be put on leave." } as const;
  const allowed = isOwnerRole(role) || (role === 2 && user.role_id === 3 && (await getManagerSalesmanIds(actorId)).includes(user.id));
  if (!allowed) return { error: "You can't manage leave for this person." } as const;
  return { actorId, user } as const;
}

/** Companies the person works for (their own links, not ones they cover). */
async function ownOrgIds(user: { id: number; role_id: number }) {
  const rows =
    user.role_id === 2
      ? await prisma.managerOrg.findMany({ where: { manager_id: user.id }, select: { org_id: true } })
      : await prisma.managerSalesman.findMany({ where: { salesman_id: user.id }, select: { org_id: true }, distinct: ["org_id"] });
  return rows.map((r) => r.org_id);
}

async function coverCandidates(user: { id: number; role_id: number }) {
  const orgIds = await ownOrgIds(user);
  const sharesCompany =
    user.role_id === 2 ? { managerOrgs: { some: { org_id: { in: orgIds } } } } : { salesmanManager: { some: { org_id: { in: orgIds } } } };
  return prisma.user.findMany({
    where: { role_id: user.role_id, id: { not: user.id }, ...(orgIds.length ? sharesCompany : {}) },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

/** Leave that still blocks [start, end]: overlapping and not returned before it began. */
const overlapping = (start: Date, end: Date) => ({
  start_date: { lte: end },
  end_date: { gte: start },
  OR: [{ returned_at: null }, { returned_at: { gt: start } }],
});

/** Why [start, end] can't be booked for `user` with `coverId`, or null. `exceptId`: the leave being extended. */
async function leaveClash(user: { id: number; name: string }, coverId: number, start: Date, end: Date, exceptId?: number) {
  const not = exceptId ? { id: { not: exceptId } } : {};
  const [ownClash, coverAway, coveringOthers] = await Promise.all([
    prisma.userLeave.findFirst({ where: { user_id: user.id, ...not, ...overlapping(start, end) }, select: { id: true } }),
    prisma.userLeave.findFirst({ where: { user_id: coverId, ...overlapping(start, end) }, select: { user: { select: { name: true } } } }),
    prisma.userLeave.findFirst({ where: { cover_user_id: user.id, ...overlapping(start, end) }, select: { user: { select: { name: true } } } }),
  ]);
  if (ownClash) return `${user.name} already has leave on some of those dates.`;
  if (coverAway) return `${coverAway.user.name} is on leave then too. Pick someone else.`;
  if (coveringOthers) return `${user.name} is covering for ${coveringOthers.user.name} then. Give ${coveringOthers.user.name} another cover first.`;
  return null;
}

export async function getLeaveInfo(userId: number): Promise<{ success: true; info: LeaveInfo } | { success: false; error: string }> {
  const auth = await authorize(userId);
  if ("error" in auth) return { success: false, error: auth.error! };
  const [leaves, candidates] = await Promise.all([
    prisma.userLeave.findMany({ where: { user_id: userId }, include: { cover: { select: { name: true } } }, orderBy: { start_date: "desc" } }),
    coverCandidates(auth.user),
  ]);
  const today = todayUtc();
  const rows = leaves.map((l) => ({
    id: l.id,
    start: iso(l.start_date),
    end: iso(l.end_date),
    returnedAt: l.returned_at ? iso(l.returned_at) : null,
    coverName: l.cover.name,
    state: leaveState(l, today),
    days: leaveDaysTaken(l, today),
  }));
  return { success: true, info: { user: auth.user, leaves: rows, totalDays: rows.reduce((n, r) => n + r.days, 0), candidates } };
}

export async function startLeave(input: { userId: number; coverId: number; start: string; end: string }): Promise<Result> {
  const auth = await authorize(input.userId);
  if ("error" in auth) return { success: false, error: auth.error! };
  const start = parseDateOnly(input.start);
  const end = parseDateOnly(input.end);
  if (!start || !end) return { success: false, error: "Enter the leave dates." };
  if (end < start) return { success: false, error: "The return date can't be before the start date." };
  if (end < todayUtc()) return { success: false, error: "That leave is already over." };

  const coverId = Number(input.coverId);
  if (!(await coverCandidates(auth.user)).some((c) => c.id === coverId)) {
    return { success: false, error: auth.user.role_id === 2 ? "Pick another manager from the same company." : "Pick another salesman from the same company." };
  }

  const clash = await leaveClash(auth.user, coverId, start, end);
  if (clash) return { success: false, error: clash };

  await prisma.userLeave.create({
    data: { user_id: auth.user.id, cover_user_id: coverId, start_date: start, end_date: end, created_by_id: auth.actorId },
  });
  revalidatePath("/dashboard", "layout");
  return { success: true };
}

/** Back early (or cancel one that hasn't started). Access for the cover ends at once. */
export async function endLeave(leaveId: number): Promise<Result> {
  const leave = await prisma.userLeave.findUnique({ where: { id: Number(leaveId) } });
  if (!leave) return { success: false, error: "Leave not found." };
  const auth = await authorize(leave.user_id);
  if ("error" in auth) return { success: false, error: auth.error! };
  const state = leaveState(leave, todayUtc());
  if (state === "ended") return { success: false, error: "That leave is already over." };
  if (state === "upcoming") await prisma.userLeave.delete({ where: { id: leave.id } });
  else await prisma.userLeave.update({ where: { id: leave.id }, data: { returned_at: new Date() } });
  revalidatePath("/dashboard", "layout");
  return { success: true };
}

/** Move the last day of a current or upcoming leave (longer or shorter); same clash rules as a new leave. */
export async function extendLeave(leaveId: number, newEnd: string): Promise<Result> {
  const leave = await prisma.userLeave.findUnique({ where: { id: Number(leaveId) } });
  if (!leave) return { success: false, error: "Leave not found." };
  const auth = await authorize(leave.user_id);
  if ("error" in auth) return { success: false, error: auth.error! };
  if (leaveState(leave, todayUtc()) === "ended") return { success: false, error: "That leave is already over." };
  const end = parseDateOnly(newEnd);
  if (!end) return { success: false, error: "Enter the new return date." };
  if (end < leave.start_date) return { success: false, error: "The return date can't be before the start date." };
  if (end < todayUtc()) return { success: false, error: "Pick today or a later date." };
  const clash = await leaveClash(auth.user, leave.cover_user_id, leave.start_date, end, leave.id);
  if (clash) return { success: false, error: clash };
  await prisma.userLeave.update({ where: { id: leave.id }, data: { end_date: end } });
  revalidatePath("/dashboard", "layout");
  return { success: true };
}
