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
/** The KYC documents every client needs, each with an expiry date. */
export const KYC_DOC_TYPES = { cr: "CR", computer_card: "Computer card", signatory_id: "Authorised signatory ID" } as const;
export type KycDocType = keyof typeof KYC_DOC_TYPES;
/** Every document type a client file can be tagged with: the KYC ones plus the credit agreement (not part of KYC). */
export const CLIENT_DOC_TYPES = { ...KYC_DOC_TYPES, credit_agreement: "Credit Agreement Copy" } as const;
export type ClientDocType = keyof typeof CLIENT_DOC_TYPES;
export const isClientDocType = (v: unknown): v is ClientDocType => typeof v === "string" && v in CLIENT_DOC_TYPES;
export const isKycDocType = (v: unknown): v is KycDocType => typeof v === "string" && v in KYC_DOC_TYPES;

/**
 * KYC is up to date when each KYC document type has at least one document whose expiry is today or later.
 * `missing` / `expired` list the labels of what's wrong.
 */
export function kycStatus(docs: { doc_type: string | null; expiry_date: string | null }[], today = new Date().toISOString().slice(0, 10)) {
  const missing: string[] = [];
  const expired: string[] = [];
  for (const [type, label] of Object.entries(KYC_DOC_TYPES)) {
    const ofType = docs.filter((d) => d.doc_type === type);
    if (ofType.length === 0) missing.push(label);
    else if (!ofType.some((d) => d.expiry_date && d.expiry_date >= today)) expired.push(label);
  }
  return { ok: missing.length === 0 && expired.length === 0, missing, expired };
}

export type ClientDocumentItem = {
  id: number;
  description: string;
  /** KYC document type, or null for other paperwork. */
  doc_type: ClientDocType | null;
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
