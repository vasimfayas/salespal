import { Suspense } from "react";
import { getShippingRates } from "@/lib/cached-queries";
import { PageHeader } from "@/components/layout/PageHeader";
import { ShippingRateTable } from "@/components/shipping-rates/ShippingRateTable";
import { Skeleton } from "@/components/ui/Skeleton";

/** Read-only rate finder + directory for managers (accounts maintain the rates). */
export default function ManagerShippingRatesPage() {
  return (
    <>
      <PageHeader title="Shipping Rates" subtitle="Find contract rates by lane, carrier and container to quote clients." />
      <Suspense fallback={<ShippingRatesSkeleton />}>
        <ShippingRatesSection />
      </Suspense>
    </>
  );
}

async function ShippingRatesSection() {
  const rates = await getShippingRates();
  return <ShippingRateTable initialRates={rates} />;
}

function ShippingRatesSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full rounded-card" />
      <Skeleton className="h-96 w-full rounded-card" />
    </div>
  );
}
