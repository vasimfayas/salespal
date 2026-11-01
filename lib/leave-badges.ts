import { prisma } from "@/lib/prisma";
import { todayUtc } from "@/lib/salesman-targets";
import { leaveState } from "@/lib/leave";
import { activeLeaveWhere } from "@/lib/scoping";
import type { LeaveBadge } from "@/components/users/LeaveButton";

/** Current (or else next) leave per user, for the "On leave" badge in user / team lists. */
export async function getLeaveBadges(userIds?: number[]): Promise<Record<number, LeaveBadge>> {
  const today = todayUtc();
  const leaves = await prisma.userLeave.findMany({
    where: { end_date: { gte: today }, ...(userIds ? { user_id: { in: userIds } } : {}) },
    select: { user_id: true, start_date: true, end_date: true, returned_at: true, cover: { select: { name: true } } },
    orderBy: { start_date: "asc" },
  });
  const badges: Record<number, LeaveBadge> = {};
  for (const l of leaves) {
    const state = leaveState(l, today);
    if (state === "ended" || badges[l.user_id]?.state === "active") continue;
    if (state === "active" || !badges[l.user_id]) {
      // Planned length; coming back early is in the dialog's history.
      const days = Math.round((l.end_date.getTime() - l.start_date.getTime()) / 86_400_000) + 1;
      badges[l.user_id] = { state, start: l.start_date.toISOString().slice(0, 10), end: l.end_date.toISOString().slice(0, 10), coverName: l.cover.name, days };
    }
  }
  return badges;
}

/** Whom the user is covering for today, for the banner at the top of their screens. */
export async function getCoveringFor(userId: number) {
  return prisma.userLeave.findMany({
    where: { cover_user_id: userId, ...activeLeaveWhere() },
    select: { end_date: true, user: { select: { name: true } } },
    orderBy: { end_date: "asc" },
  });
}
