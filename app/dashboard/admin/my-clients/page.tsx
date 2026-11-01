import { Suspense } from "react";
import { getSalesPalSession } from "@/lib/auth";
import { getClientsPage } from "@/lib/clients-list";
import { getCachedAdminOrgs } from "@/lib/cached-queries";
import type { SearchParams } from "@/lib/list-params";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { ManagerClientsList } from "../../manager/clients/ManagerClientsList";

/** Owner / super admin: the clients assigned to them personally (they can add clients under any company). */
export default async function AdminMyClientsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  return (
    <>
      <PageHeader title="My Clients" subtitle="Clients you handle yourself. Everyone's clients are under Clients." />
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-card" />}>
        <MyClientsSection params={params} />
      </Suspense>
    </>
  );
}

async function MyClientsSection({ params }: { params: SearchParams }) {
  const session = await getSalesPalSession();
  const ownerId = Number(session!.user.id);
  const [orgs, clients] = await Promise.all([getCachedAdminOrgs(), getClientsPage({ assigned_salesman_id: ownerId }, params)]);
  const companies = orgs.map((o) => ({ id: o.id, name: o.name }));
  const me = { id: ownerId, name: `Me (${session!.user.name})`, org_ids: companies.map((c) => c.id) };

  return (
    <ManagerClientsList
      initialClients={clients.rows}
      total={clients.total}
      page={clients.page}
      pageSize={clients.pageSize}
      salesmen={[me]}
      companies={companies}
      clientHrefBase="/dashboard/admin/clients"
      canBulkAssign={false}
    />
  );
}
