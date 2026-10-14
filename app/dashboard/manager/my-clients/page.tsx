import { Suspense } from "react";
import { getSalesPalSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getClientsPage } from "@/lib/clients-list";
import type { SearchParams } from "@/lib/list-params";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { ManagerClientsList } from "../clients/ManagerClientsList";

export default async function ManagerMyClientsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  return (
    <>
      <PageHeader title="My Clients" subtitle="Clients assigned to you. Your sales team's clients are under Clients." />
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-card" />}>
        <MyClientsSection params={params} />
      </Suspense>
    </>
  );
}

async function MyClientsSection({ params }: { params: SearchParams }) {
  const session = await getSalesPalSession();
  const managerId = Number(session!.user.id);
  const managerOrgs = await prisma.managerOrg.findMany({
    where: { manager_id: managerId },
    select: { org: { select: { id: true, name: true } } },
    orderBy: { org: { name: "asc" } },
  });
  const me = { id: managerId, name: `Me (${session!.user.name})`, org_ids: managerOrgs.map((m) => m.org.id) };
  const clients = await getClientsPage({ assigned_salesman_id: managerId }, params);

  return (
    <ManagerClientsList
      initialClients={clients.rows}
      total={clients.total}
      page={clients.page}
      pageSize={clients.pageSize}
      salesmen={[me]}
      companies={managerOrgs.map((item) => item.org)}
    />
  );
}
