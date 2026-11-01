import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isOwnerRole, SUPER_ADMIN_ROLE } from "@/lib/roles";
import { visibleTo } from "@/lib/task-privacy";

export type ScopedToken = {
  id?: number;
  role_id?: number;
  org_ids?: number[];
  manager_ids?: number[];
};

export function getTokenUserId(token: ScopedToken) {
  return Number(token.id);
}

/** Active leave right now (date-only, UTC like todayUtc): started, not past end_date, not returned early. */
export function activeLeaveWhere(): Prisma.UserLeaveWhereInput {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return { start_date: { lte: today }, end_date: { gte: today }, returned_at: null };
}

/** People `userId` is covering for today (same role: a manager for a manager, a salesman for a salesman). */
export async function getCoveredUserIds(userId: number) {
  const rows = await prisma.userLeave.findMany({ where: { cover_user_id: userId, ...activeLeaveWhere() }, select: { user_id: true } });
  return rows.map((r) => r.user_id);
}

/** The user plus everyone they cover for: whose work they act on today. */
export async function getActingUserIds(userId: number) {
  return [userId, ...(await getCoveredUserIds(userId))];
}

/** Read fresh on every request. A manager covering for another manager also runs that manager's companies. */
export async function getManagerOrgIds(managerId: number) {
  const orgs = await prisma.managerOrg.findMany({ where: { manager_id: { in: await getActingUserIds(managerId) } }, select: { org_id: true }, distinct: ["org_id"] });
  return orgs.map((item) => item.org_id);
}

/** Read fresh on every request (not from the JWT) so owner re-assignments apply without a re-login. */
export async function getAccountantOrgIds(accountantId: number) {
  const orgs = await prisma.accountantOrg.findMany({ where: { accountant_id: accountantId }, select: { org_id: true } });
  return orgs.map((item) => item.org_id);
}

export async function getOperationsOrgIds(userId: number) {
  const orgs = await prisma.operationsOrg.findMany({ where: { user_id: userId }, select: { org_id: true } });
  return orgs.map((item) => item.org_id);
}

/**
 * Companies a salesman works for: the ones they were given under each manager (not every company the
 * manager runs). Read fresh so owner / manager changes apply without a re-login.
 */
export async function getSalesmanOrgIds(salesmanId: number) {
  const orgs = await prisma.managerSalesman.findMany({ where: { salesman_id: { in: await getActingUserIds(salesmanId) } }, select: { org_id: true }, distinct: ["org_id"] });
  return orgs.map((item) => item.org_id);
}

/** The manager's team: salesmen working under them (or a manager they cover for) for any of their companies. */
export async function getManagerSalesmanIds(managerId: number) {
  const salesmen = await prisma.managerSalesman.findMany({ where: { manager_id: { in: await getActingUserIds(managerId) } }, select: { salesman_id: true }, distinct: ["salesman_id"] });
  return salesmen.map((item) => item.salesman_id);
}

/** Salesmen working under the manager for one specific company. */
export async function getManagerSalesmanIdsForOrg(managerId: number, orgId: number) {
  const salesmen = await prisma.managerSalesman.findMany({ where: { manager_id: { in: await getActingUserIds(managerId) }, org_id: orgId }, select: { salesman_id: true }, distinct: ["salesman_id"] });
  return salesmen.map((item) => item.salesman_id);
}

export async function clientScopeWhere(token: ScopedToken): Promise<Prisma.ClientWhereInput> {
  const userId = getTokenUserId(token);
  if (isOwnerRole(token.role_id)) return {};
  if (token.role_id === 2) {
    const orgIds = await getManagerOrgIds(userId);
    return { org_id: { in: orgIds } };
  }
  if (token.role_id === 3) return { assigned_salesman_id: { in: await getActingUserIds(userId) } };
  return { id: -1 };
}

export async function orderScopeWhere(token: ScopedToken): Promise<Prisma.OrderWhereInput> {
  const userId = getTokenUserId(token);
  if (isOwnerRole(token.role_id)) return {};
  // Accountants and managers see the orders of their companies (an order's company is its enquiry's).
  if (token.role_id === 4) return { org_id: { in: await getAccountantOrgIds(userId) } };
  if (token.role_id === 2) {
    const orgIds = await getManagerOrgIds(userId);
    return { org_id: { in: orgIds } };
  }
  if (token.role_id === 3) return { created_by_id: { in: await getActingUserIds(userId) } };
  return { id: -1 };
}

export type OrderStatsScope = { role_id: number; userId: number; orgIds: number[] };

/** Same role branching as orderScopeWhere, reshaped into plain values a raw SQL query can filter by. */
export async function orderStatsScope(token: ScopedToken): Promise<OrderStatsScope> {
  const userId = getTokenUserId(token);
  if (token.role_id === 2) {
    const orgIds = await getManagerOrgIds(userId);
    return { role_id: 2, userId, orgIds };
  }
  return { role_id: token.role_id ?? 0, userId, orgIds: [] };
}

/** Who can see a task. A personal to-do is only ever visible to the person it belongs to, whatever their role. */
export async function taskScopeWhere(token: ScopedToken): Promise<Prisma.TaskWhereInput> {
  const userId = getTokenUserId(token);
  return { AND: [await taskRoleScope(token, userId), visibleTo(userId)] };
}

async function taskRoleScope(token: ScopedToken, userId: number): Promise<Prisma.TaskWhereInput> {
  if (isOwnerRole(token.role_id)) return {};
  if (token.role_id === 2) {
    const [acting, salesmanIds] = await Promise.all([getActingUserIds(userId), getManagerSalesmanIds(userId)]);
    return { OR: [{ created_by_id: { in: acting } }, { assigned_to_id: { in: [...acting.slice(1), ...salesmanIds] } }] };
  }
  if (token.role_id === 3) {
    const acting = await getActingUserIds(userId);
    return { OR: [{ assigned_to_id: { in: acting } }, { created_by_id: { in: acting } }] };
  }
  // Accountant / operations: only their own tasks (they can add to-dos).
  if (token.role_id === 4 || token.role_id === 5) return { OR: [{ assigned_to_id: userId }, { created_by_id: userId }] };
  return { id: -1 };
}

export async function userScopeWhere(token: ScopedToken): Promise<Prisma.UserWhereInput> {
  const userId = getTokenUserId(token);
  if (isOwnerRole(token.role_id)) return {};
  if (token.role_id === 2) {
    const [acting, salesmanIds] = await Promise.all([getActingUserIds(userId), getManagerSalesmanIds(userId)]);
    return { id: { in: [...acting, ...salesmanIds] } };
  }
  if (token.role_id === 3) return { id: { in: await getActingUserIds(userId) } };
  return { id: -1 };
}

export async function canAccessSalesman(token: ScopedToken, salesmanId: number) {
  const userId = getTokenUserId(token);
  if (isOwnerRole(token.role_id)) return true;
  if (token.role_id === 3) return (await getActingUserIds(userId)).includes(salesmanId);
  if (token.role_id === 2) {
    const salesmanIds = await getManagerSalesmanIds(userId);
    return salesmanIds.includes(salesmanId);
  }
  return false;
}

/** Permission gate: one of `roles`, or the super admin (who may do everything). Use isRole for role-specific restrictions. */
export function hasRole(token: ScopedToken, roles: number | number[]) {
  return Number(token.role_id) === SUPER_ADMIN_ROLE || isRole(token, roles);
}

export function isRole(token: ScopedToken, roles: number | number[]) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return allowed.includes(Number(token.role_id));
}
