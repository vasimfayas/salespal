/** Suggested labels for company paperwork; any free-text label is allowed. */
export const companyDocumentLabels = ["CR Copy", "Export License", "Import License", "VAT Certificate", "Chamber of Commerce", "Trade License"];

export const COMPANY_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;

export const companyDocumentMimeTypes: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export const COMPANY_DOCUMENT_ACCEPT = Object.keys(companyDocumentMimeTypes).map((ext) => `.${ext}`).join(",");

/** Documents expiring within this many days are flagged as "expiring soon". */
export const DOCUMENT_EXPIRY_WARNING_DAYS = 30;

export type CompanyDocumentItem = {
  id: number;
  label: string;
  doc_number: string | null;
  expiry_date: string | null; // YYYY-MM-DD
  file_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: string;
  updated_at: string;
};

export type DocumentExpiryState = "none" | "valid" | "expiring" | "expired";

export function documentExpiryState(expiryDate: string | null, today = new Date()): DocumentExpiryState {
  if (!expiryDate) return "none";
  const todayIso = today.toISOString().slice(0, 10);
  if (expiryDate < todayIso) return "expired";
  const warn = new Date(today.getTime() + DOCUMENT_EXPIRY_WARNING_DAYS * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return expiryDate <= warn ? "expiring" : "valid";
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** The company's CR (commercial registration) document, identified by its label, e.g. "CR Copy". */
export function findCrDocument<T extends { label: string }>(documents: T[]): T | undefined {
  return documents.find((d) => /^c\.?r\.?\b|commercial registration/i.test(d.label.trim()));
}

/** Logos are PNG / JPG (what the enquiry PDF can embed), up to 2 MB. */
export const COMPANY_LOGO_MAX_BYTES = 2 * 1024 * 1024;
export const COMPANY_LOGO_ACCEPT = ".png,.jpg,.jpeg";

/** URL of a company's logo, or null; the stored file name versions it so a replaced logo isn't served from cache. */
export function companyLogoUrl(org: { id: number; logo_path: string | null }) {
  return org.logo_path ? `/api/companies/${org.id}/logo?v=${encodeURIComponent(org.logo_path.split(/[\\/]/).pop()!)}` : null;
}
