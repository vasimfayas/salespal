import path from "node:path";
import { readDocumentFile } from "@/lib/company-documents";

const TYPES: Record<string, string> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" };

/** The company logo as an inline email attachment (shown without the reader allowing remote images), or null when it has none / the file is gone. */
export async function emailLogo(org: { logo_path: string | null }) {
  if (!org.logo_path) return null;
  try {
    const ext = path.extname(org.logo_path).slice(1).toLowerCase();
    return { filename: `logo.${ext}`, content: await readDocumentFile(org.logo_path), contentType: TYPES[ext] ?? "image/png", cid: "logo" };
  } catch {
    return null;
  }
}
