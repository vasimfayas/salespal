import path from "node:path";
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSalesPalSession } from "@/lib/auth";
import { readDocumentFile, removeDocumentFile, storeUploadedFile } from "@/lib/company-documents";
import { COMPANY_LOGO_MAX_BYTES } from "@/types/company";

type Params = { params: Promise<{ id: string }> };

const LOGO_TYPES: Record<string, string> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" };

function revalidateCompanyViews() {
  revalidateTag("admin-companies", { expire: 0 });
  revalidatePath("/dashboard/admin/companies");
}

/** The logo image. Public: it's branding, shown on company cards, enquiry PDFs and the client's enquiry form (no sign-in). */
export async function GET(_req: Request, context: Params) {
  const org = await prisma.organization.findUnique({ where: { id: Number((await context.params).id) }, select: { logo_path: true } });
  if (!org?.logo_path) return NextResponse.json({ error: "No logo" }, { status: 404 });
  let data: Buffer;
  try {
    data = await readDocumentFile(org.logo_path);
  } catch {
    return NextResponse.json({ error: "The stored logo is missing. Upload it again." }, { status: 410 });
  }
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": LOGO_TYPES[path.extname(org.logo_path).slice(1).toLowerCase()] ?? "application/octet-stream",
      "Content-Length": String(data.length),
      // The URL carries the file name (?v=), so a new logo gets a new URL.
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** Owner uploads or replaces the logo (multipart: file). */
export async function POST(req: Request, context: Params) {
  const session = await getSalesPalSession();
  if (!session || session.user.role_id !== 1) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orgId = Number((await context.params).id);
  const org = await prisma.organization.findUnique({ where: { id: orgId }, select: { logo_path: true } });
  if (!org) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const file = (await req.formData()).get("file");
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Choose an image" }, { status: 400 });
  if (!LOGO_TYPES[path.extname(file.name).slice(1).toLowerCase()]) return NextResponse.json({ error: "Upload a PNG or JPG image" }, { status: 400 });
  if (file.size > COMPANY_LOGO_MAX_BYTES) return NextResponse.json({ error: "The logo must be 2 MB or smaller" }, { status: 400 });

  const stored = await storeUploadedFile(path.join("companies", String(orgId), "logo"), file);
  try {
    await prisma.organization.update({ where: { id: orgId }, data: { logo_path: stored.file_path } });
  } catch {
    await removeDocumentFile(stored.file_path);
    return NextResponse.json({ error: "Failed to save the logo. Please try again." }, { status: 500 });
  }
  if (org.logo_path) await removeDocumentFile(org.logo_path);
  revalidateCompanyViews();
  return NextResponse.json({ ok: true });
}

/** Owner removes the logo. */
export async function DELETE(_req: Request, context: Params) {
  const session = await getSalesPalSession();
  if (!session || session.user.role_id !== 1) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orgId = Number((await context.params).id);
  const org = await prisma.organization.findUnique({ where: { id: orgId }, select: { logo_path: true } });
  if (!org) return NextResponse.json({ error: "Company not found" }, { status: 404 });
  await prisma.organization.update({ where: { id: orgId }, data: { logo_path: null } });
  if (org.logo_path) await removeDocumentFile(org.logo_path);
  revalidateCompanyViews();
  return NextResponse.json({ ok: true });
}
