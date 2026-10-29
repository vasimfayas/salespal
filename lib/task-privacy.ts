import { Prisma } from "@prisma/client";

/** Category of a personal "To do": only the person it belongs to can see it, whatever their role. */
export const TODO_CATEGORY = "todo";

/** Prisma filter: every task except to-dos (for team-wide lists and counts, where nobody else's to-do belongs). */
export const notTodo = { OR: [{ category: null }, { category: { not: TODO_CATEGORY } }] } satisfies Prisma.TaskWhereInput;

/** Prisma filter: tasks that aren't to-dos, plus this user's own to-dos. */
export const visibleTo = (userId: number) => ({ OR: [...notTodo.OR, { assigned_to_id: userId }] }) satisfies Prisma.TaskWhereInput;

/** Same rule for raw SQL on `tasks` (alias given); with no viewer every to-do is hidden. */
export function todoPrivacySql(alias: string, viewerId?: number | null) {
  const a = Prisma.raw(alias);
  return viewerId
    ? Prisma.sql`(${a}.category IS DISTINCT FROM ${TODO_CATEGORY} OR ${a}.assigned_to_id = ${viewerId})`
    : Prisma.sql`${a}.category IS DISTINCT FROM ${TODO_CATEGORY}`;
}
