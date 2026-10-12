import { Suspense } from "react";
import { getShippingRates } from "@/lib/cached-queries";
import { getExchangeRates } from "@/lib/exchange-rates";
import { PageHeader } from "@/components/layout/PageHeader";
import { ShippingRateTable } from "@/components/shipping-rates/ShippingRateTable";
import { Skeleton } from "@/components/ui/Skeleton";

/** Rate finder + directory for operations to price enquiries (read-only). */
export default function OperationsShippingRatesPage() {
  return (
    <>
      <PageHeader title="Shipping Rates" subtitle="Find contract rates by lane, carrier and container to price enquiries." />
      <Suspense fallback={<ShippingRatesSkeleton />}>
        <ShippingRatesSection />
      </Suspense>
    </>
  );
}

async function ShippingRatesSection() {
  const [rates, fx] = await Promise.all([getShippingRates(), getExchangeRates()]);
  return <ShippingRateTable initialRates={rates} fx={fx} />;
}

function ShippingRatesSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full rounded-card" />
      <Skeleton className="h-96 w-full rounded-card" />
    </div>
  );
}
