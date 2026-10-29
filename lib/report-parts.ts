/** Which detail tables a company report can include. Kept apart from lib/company-report.ts so the form can import it. */
export const reportParts = ["orders", "enquiries", "confirmed", "lost"] as const;
export type ReportPart = (typeof reportParts)[number];
export const reportPartLabels: Record<ReportPart, string> = { orders: "Orders", enquiries: "All enquiries", confirmed: "Confirmed enquiries", lost: "Lost enquiries & orders" };
