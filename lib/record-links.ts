/**
 * Where an order / enquiry reference should take each role. Client-safe (no server imports).
 *   enquiry → that role's enquiries page with ?view=<id>, which opens the enquiry's detail panel
 *   order   → salesman: the order page; manager / accounts / owner / super admin: their orders list filtered to the
 *             order and expanded (operations has no orders screen, so no link)
 */
export type AppRole = "admin" | "manager" | "salesman" | "accountant" | "operations";

export const ROLE_BY_ID: Record<number, AppRole> = { 1: "admin", 2: "manager", 3: "salesman", 4: "accountant", 5: "operations", 6: "admin" };

export const orderNo = (id: number) => `#${String(id).padStart(5, "0")}`;

export function enquiryHref(role: AppRole, enquiryId: number) {
  return `/dashboard/${role}/enquiries?view=${enquiryId}`;
}

export function orderHref(role: AppRole, orderId: number): string | null {
  if (role === "salesman") return `/dashboard/salesman/orders/${orderId}`;
  if (role === "manager" || role === "accountant" || role === "admin") return `/dashboard/${role}/orders?q=${encodeURIComponent(orderNo(orderId))}&open=${orderId}`;
  return null;
}
