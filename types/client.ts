export const clientStatuses = [
  "lead",
  "contacted",
  "follow_up",
  "enquiry",
  "onboarded",
  "dormant",
  "lost",
  "blacklisted"
] as const;
export type ClientStatus = (typeof clientStatuses)[number];

export const clientStatusLabels: Record<ClientStatus, string> = {
  lead: "Lead",
  contacted: "Contacted",
  follow_up: "Follow up",
  enquiry: "Enquiry",
  onboarded: "Onboarded",
  dormant: "Not enquired (2 months)",
  lost: "Lost",
  blacklisted: "Black list",
};

export function clientStatusLabel(status: string) {
  return clientStatusLabels[status as ClientStatus] ?? status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Only managers and admins may put a client on, or take it off, the black list. */
export const MANAGER_ONLY_STATUSES: readonly ClientStatus[] = ["blacklisted"];

/** Onboarded clients with no enquiry (or order) for this many days become "dormant". */
export const DORMANT_AFTER_DAYS = 60;

/** Client categories. "standard" is the default; add more here (e.g. "key_account") as they're needed. */
export const clientCategories = ["standard", "premium"] as const;
export type ClientCategory = (typeof clientCategories)[number];
export const clientCategoryLabels: Record<ClientCategory, string> = { standard: "Standard", premium: "Premium" };
export function isClientCategory(value: unknown): value is ClientCategory {
  return clientCategories.includes(value as ClientCategory);
}

export type ClientListItem = {
  id: number;
  name: string;
  contact_person_name: string;
  contact_no: string;
  status: ClientStatus | string;
  organization?: { name: string };
  assignedSalesman?: { name: string };
};

export type ClientLogItem = {
  id: number;
  action: string;
  created_at: string;
  author?: { name: string };
};

/** A file attached to a client (description + optional expiry). */
export type ClientDocumentItem = {
  id: number;
  description: string;
  expiry_date: string | null; // YYYY-MM-DD
  file_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by_id: number;
  uploaded_by: string;
  created_at: string;
};

/** "Company · Department" for a department of a company handled per department; just the name otherwise. */
export const clientLabel = (client: { name: string; department?: string | null }) =>
  client.department ? `${client.name} · ${client.department}` : client.name;
