import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getManagerSalesmanIds } from "@/lib/scoping";
import { isOwnerRole } from "@/lib/roles";
import { taskKindSql } from "@/lib/tasks-list";
import type { TaskKind } from "@/types/task";

export type CalendarTask = {
  id: number;
  description: string;
  /** YYYY-MM-DD (the stored due date, no time zone shift). */
  date: string;
  status: string;
  kind: TaskKind;
  assigned_to_id: number;
  assignedName: string;
  clientId: number | null;
  clientName: string | null;
};

/** Per day and kind: how many tasks. Feeds the year view. */
export type CalendarSummaryRow = { date: string; kind: TaskKind; count: number };

/** Most rows a month / week request returns; `truncated` tells the page there were more. */
export const CALENDAR_ROW_LIMIT = 3000;

type Viewer = { id: number; role_id: number };

/**
 * Whose tasks a viewer sees: the owner and super admin everyone's, a manager their team's and their own,
 * everyone else the tasks they created or hold.
 */
async function scopeSql(viewer: Viewer) {
  if (isOwnerRole(viewer.role_id)) return Prisma.sql`TRUE`;
  const mine = Prisma.sql`t.created_by_id = ${viewer.id} OR t.assigned_to_id = ${viewer.id}`;
  if (viewer.role_id === 2) {
    const team = await getManagerSalesmanIds(viewer.id);
    return team.length ? Prisma.sql`(${mine} OR t.assigned_to_id IN (${Prisma.join(team)}))` : Prisma.sql`(${mine})`;
  }
  return Prisma.sql`(${mine})`;
}

const dayRange = (from: string, to: string) => Prisma.sql`t.due_date >= ${from}::date AND t.due_date < (${to}::date + 1)`;

export async function getCalendarTasks(viewer: Viewer, from: string, to: string, assignee?: number) {
  const where = Prisma.sql`${await scopeSql(viewer)} AND ${dayRange(from, to)}${assignee ? Prisma.sql` AND t.assigned_to_id = ${assignee}` : Prisma.empty}`;
  const rows = await prisma.$queryRaw<
    { id: number; description: string; date: string; status: string; kind: TaskKind; assigned_to_id: number; assigned_name: string; client_id: number | null; client_name: string | null }[]
  >(Prisma.sql`
    SELECT t.id, t.description, to_char(t.due_date, 'YYYY-MM-DD') AS date, t.status, ${taskKindSql} AS kind, t.assigned_to_id, a.name AS assigned_name,
           t.client_id, CASE WHEN cl.department IS NULL THEN cl.name ELSE cl.name || ' · ' || cl.department END AS client_name
    FROM tasks t
    JOIN users a ON a.id = t.assigned_to_id
    LEFT JOIN clients cl ON cl.id = t.client_id
    WHERE ${where}
    ORDER BY t.due_date, t.id
    LIMIT ${CALENDAR_ROW_LIMIT + 1}`);
  const tasks: CalendarTask[] = rows.slice(0, CALENDAR_ROW_LIMIT).map((r) => ({
    id: r.id,
    description: r.description,
    date: r.date,
    status: r.status,
    kind: r.kind,
    assigned_to_id: r.assigned_to_id,
    assignedName: r.assigned_name,
    clientId: r.client_id,
    clientName: r.client_name,
  }));
  return { tasks, truncated: rows.length > CALENDAR_ROW_LIMIT };
}

export async function getCalendarSummary(viewer: Viewer, from: string, to: string, assignee?: number): Promise<CalendarSummaryRow[]> {
  const where = Prisma.sql`${await scopeSql(viewer)} AND ${dayRange(from, to)}${assignee ? Prisma.sql` AND t.assigned_to_id = ${assignee}` : Prisma.empty}`;
  const rows = await prisma.$queryRaw<{ date: string; kind: TaskKind; count: number }[]>(Prisma.sql`
    SELECT to_char(t.due_date, 'YYYY-MM-DD') AS date, ${taskKindSql} AS kind, COUNT(*)::int AS count
    FROM tasks t
    WHERE ${where}
    GROUP BY 1, 2`);
  return rows.map((r) => ({ date: r.date, kind: r.kind, count: Number(r.count) }));
}
