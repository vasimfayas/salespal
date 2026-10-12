import { redirect } from "next/navigation";
import { getSalesPalSession } from "@/lib/auth";
import { getShippingRates } from "@/lib/cached-queries";
import { getExchangeRates } from "@/lib/exchange-rates";
import { SUPER_ADMIN_ROLE } from "@/lib/roles";
import { PageHeader } from "@/components/layout/PageHeader";
import { ShippingRateTable } from "@/components/shipping-rates/ShippingRateTable";

/** Super admin: the rate card with add, edit and delete. */
export default async function AdminShippingRatesPage() {
  const session = await getSalesPalSession();
  if (session?.user.role_id !== SUPER_ADMIN_ROLE) redirect("/dashboard/admin");
  const [rates, fx] = await Promise.all([getShippingRates(), getExchangeRates()]);
  return (
    <>
      <PageHeader title="Shipping Rates" subtitle="Find, add, update and delete contract rates." />
      <ShippingRateTable initialRates={rates} fx={fx} editable />
    </>
  );
}
