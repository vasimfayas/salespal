import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { LocationsClient } from "@/components/locations/LocationsClient";
import { getSalesPalSession } from "@/lib/auth";
import { LOCATION_EDITOR_ROLES, getLocations } from "@/lib/locations-db";

/** Owner / super admin: the master list of ports, airports and road points the From / To pickers suggest. */
export default async function LocationsPage() {
  const session = await getSalesPalSession();
  if (!session || !LOCATION_EDITOR_ROLES.includes(session.user.role_id)) redirect("/dashboard/admin");
  return (
    <>
      <PageHeader title="Locations" subtitle="Seaports, airports and road points suggested when picking an enquiry's or a rate's origin and destination." />
      <LocationsClient locations={await getLocations()} />
    </>
  );
}
