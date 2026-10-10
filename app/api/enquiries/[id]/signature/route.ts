import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { enquiryScopeWhere } from "@/lib/enquiries";
import { readDocumentFile } from "@/lib/company-documents";

/** The client's drawn signature on an enquiry form they submitted, for anyone who can see the enquiry. */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const enquiry = await prisma.enquiry.findFirst({
    where: { AND: [{ id: Number((await context.params).id) }, await enquiryScopeWhere(token)] },
    select: { client_signature_path: true },
  });
  if (!enquiry?.client_signature_path) return NextResponse.json({ error: "No signature" }, { status: 404 });
  try {
    const data = await readDocumentFile(enquiry.client_signature_path);
    return new NextResponse(new Uint8Array(data), {
      headers: { "Content-Type": "image/png", "Cache-Control": "private, max-age=86400", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return NextResponse.json({ error: "The stored signature is missing" }, { status: 410 });
  }
}
