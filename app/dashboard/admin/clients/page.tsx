import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ClientTable } from "@/components/clients/ClientTable";
import { Skeleton } from "@/components/ui/Skeleton";
import { getClientsPage } from "@/lib/clients-list";
import { getSalesPalSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ClientAssignee } from "@/components/clients/ClientTable";
import type { SearchParams } from "@/lib/list-params";
import {
  getCachedAdminOrgs,
  getCachedAdminManagersList,
  getCachedAdminRelationsList,
} from "@/lib/cached-queries";

async function ClientTableContainer({ searchParams }: { searchParams: SearchParams }) {
  const [clients, companies, managers, managerSalesmen, session, staff] = await Promise.all([
    getClientsPage({}, searchParams),
    getCachedAdminOrgs(),
    getCachedAdminManagersList(),
    getCachedAdminRelationsList(),
    getSalesPalSession(),
    // Who the owner can reassign clients to, with the companies each works for.
    prisma.user.findMany({
      where: { role_id: { in: [2, 3] } },
      select: { id: true, name: true, role_id: true, managerOrgs: { select: { org_id: true } }, salesmanManager: { select: { org_id: true } } },
      orderBy: { name: "asc" },
    }),
  ]);
  const assignees: ClientAssignee[] = [
    { id: Number(session!.user.id), name: `Me (${session!.user.name})`, org_ids: null },
    ...staff.map((u) => ({
      id: u.id,
      name: `${u.name} · ${u.role_id === 2 ? "Manager" : "Salesman"}`,
      org_ids: [...new Set((u.role_id === 2 ? u.managerOrgs : u.salesmanManager).map((r) => r.org_id))],
    })),
  ];

  return (
    <ClientTable
      clients={clients.rows}
      total={clients.total}
      page={clients.page}
      pageSize={clients.pageSize}
      counts={clients.counts}
      companies={companies}
      managers={managers}
      managerSalesmen={managerSalesmen}
      assignees={assignees}
    />
  );
}

function ClientsTableSkeleton() {
  return (
    <div className="space-y-4 animate-page-in">
      {/* Toolbar skeleton */}
      <div className="flex flex-col gap-4 bg-card p-4 rounded-card border border-border/80 shadow-card">
        <Skeleton className="h-10 w-full rounded-md" />
        <div className="flex gap-4 border-t border-border/70 pt-3.5">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-x-auto rounded-card border border-border bg-card shadow-card">
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/5" />
              </div>
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/5" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function AdminClientsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  return (
    <>
      <PageHeader title="Client database" subtitle="Read-only view of all logistics prospects and customers." />
      <Suspense fallback={<ClientsTableSkeleton />}>
        <ClientTableContainer searchParams={params} />
      </Suspense>
    </>
  );
}
