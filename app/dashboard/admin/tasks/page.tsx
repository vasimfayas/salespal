import { redirect } from "next/navigation";
import { getSalesPalSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTasksPage } from "@/lib/tasks-list";
import type { SearchParams } from "@/lib/list-params";
import { SUPER_ADMIN_ROLE } from "@/lib/roles";
import { PageHeader } from "@/components/layout/PageHeader";
import { ManagerTasksList } from "@/components/tasks/ManagerTasksList";

/** Super admin: every salesman's tasks, assigned and managed like a manager's team. */
export default async function AdminTasksPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await getSalesPalSession();
  if (session?.user.role_id !== SUPER_ADMIN_ROLE) redirect("/dashboard/admin");
  const salesmen = await prisma.user.findMany({ where: { role_id: 3 }, select: { id: true, name: true }, orderBy: { name: "asc" } });
  const data = await getTasksPage({ assignedTo: salesmen.map((s) => s.id) }, await searchParams);
  return (
    <>
      <PageHeader title="Tasks" subtitle="Assign, manage and monitor every salesman's tasks." />
      <ManagerTasksList data={data} salesmen={salesmen} />
    </>
  );
}
