import { redirect } from "next/navigation";
import { getSalesPalSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getManagerSalesmanIds } from "@/lib/scoping";
import { isOwnerRole, SUPER_ADMIN_ROLE } from "@/lib/roles";
import { PageHeader } from "@/components/layout/PageHeader";
import { TaskCalendar, type CalendarPerson } from "@/components/calendar/TaskCalendar";

/** One calendar for every role; the data it loads is scoped to what that role may see (lib/calendar.ts). */
export default async function CalendarPage() {
  const session = await getSalesPalSession();
  if (!session) redirect("/login");
  const role = session.user.role_id;
  const userId = Number(session.user.id);

  let people: CalendarPerson[] = [];
  if (isOwnerRole(role)) {
    people = await prisma.user.findMany({ where: { role_id: { in: [2, 3] } }, select: { id: true, name: true }, orderBy: { name: "asc" } });
  } else if (role === 2) {
    const team = await getManagerSalesmanIds(userId);
    people = await prisma.user.findMany({ where: { id: { in: [userId, ...team] } }, select: { id: true, name: true }, orderBy: { name: "asc" } });
  }

  const clientsBase = isOwnerRole(role) ? "/dashboard/admin/clients" : role === 2 ? "/dashboard/manager/clients" : role === 3 ? "/dashboard/salesman/clients" : null;
  const tasksHref = role === SUPER_ADMIN_ROLE ? "/dashboard/admin/tasks" : role === 2 ? "/dashboard/manager/tasks" : role === 3 ? "/dashboard/salesman/tasks" : null;

  return (
    <>
      <PageHeader title="Calendar" subtitle="Scheduled tasks by due date. Switch between month, week and year, and filter by task type." />
      <TaskCalendar people={people} clientsBase={clientsBase} tasksHref={tasksHref} />
    </>
  );
}
