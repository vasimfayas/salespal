import { redirect } from "next/navigation";
import { getSalesPalSession } from "@/lib/auth";
import { getOrdersPage } from "@/lib/orders-list";
import type { SearchParams } from "@/lib/list-params";
import { SUPER_ADMIN_ROLE, isOwnerRole } from "@/lib/roles";
import { PageHeader } from "@/components/layout/PageHeader";
import { OrderList } from "@/components/orders/OrderList";

/** Owner and super admin: every company's orders. Super admin gets every action; the owner the accounts ones (no payments or revisions). */
export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await getSalesPalSession();
  if (!isOwnerRole(session?.user.role_id)) redirect("/dashboard/admin");
  const superAdmin = session!.user.role_id === SUPER_ADMIN_ROLE;
  const data = await getOrdersPage({}, await searchParams);
  return (
    <>
      <PageHeader title="Orders" subtitle={superAdmin ? "Every company's orders: add details, record payments, deliver, revise or cancel." : "Every company's orders: add details, deliver, complete or cancel."} />
      <OrderList data={data} role={superAdmin ? "admin" : "owner"} />
    </>
  );
}
