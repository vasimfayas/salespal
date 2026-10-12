import { redirect } from "next/navigation";
import { getSalesPalSession } from "@/lib/auth";
import { getOrdersPage } from "@/lib/orders-list";
import type { SearchParams } from "@/lib/list-params";
import { SUPER_ADMIN_ROLE } from "@/lib/roles";
import { PageHeader } from "@/components/layout/PageHeader";
import { OrderList } from "@/components/orders/OrderList";

/** Super admin: every company's orders, with every accounts and manager action. */
export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await getSalesPalSession();
  if (session?.user.role_id !== SUPER_ADMIN_ROLE) redirect("/dashboard/admin");
  const data = await getOrdersPage({}, await searchParams);
  return (
    <>
      <PageHeader title="Orders" subtitle="Every company's orders: add details, record payments, deliver, revise or cancel." />
      <OrderList data={data} role="admin" />
    </>
  );
}
