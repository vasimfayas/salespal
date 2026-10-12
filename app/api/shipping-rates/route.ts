import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/scoping";
import { orderModes } from "@/types/order";
import { containerTypesByMode, currencyTypes, DEFAULT_CURRENCY } from "@/types/shipping-rate";

import { num } from "@/lib/decimal";
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rates = await prisma.shippingRate.findMany({
    include: { updatedBy: { select: { name: true } } },
    orderBy: [{ location: "asc" }, { port: "asc" }],
  });
  return NextResponse.json({ rates: rates.map((rate) => ({ ...rate, price: num(rate.price) })) });
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Accounts and managers add rates; only accounts delete them.
  if (!hasRole(token, [2, 4])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const location = String(body.location || "").trim();
  const port = String(body.port || "").trim();
  if (!location || !port) return NextResponse.json({ error: "Location and port are required" }, { status: 400 });
  if (!orderModes.includes(body.mode)) return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  if (!containerTypesByMode[body.mode].includes(body.container)) return NextResponse.json({ error: "Pick a container or weight break that fits the mode" }, { status: 400 });
  const price = Number(body.price);
  if (!Number.isFinite(price) || price < 0) return NextResponse.json({ error: "Invalid price" }, { status: 400 });

  const duplicate = await prisma.shippingRate.findFirst({
    where: { location, port, mode: body.mode, container: body.container },
  });
  if (duplicate) {
    return NextResponse.json({ error: "A rate for this location, port, mode and container already exists — edit it instead" }, { status: 409 });
  }

  const carrier = body.carrier !== undefined ? (body.carrier ? String(body.carrier).trim() : null) : null;
  const currency = currencyTypes.includes(body.currency) ? body.currency : DEFAULT_CURRENCY;

  const rate = await prisma.shippingRate.create({
    data: {
      location,
      port,
      carrier,
      currency,
      mode: body.mode,
      container: body.container,
      price,
      updated_by_id: Number(token.id),
    } as any,
  });

  revalidateTag("shipping-rates", { expire: 0 });
  return NextResponse.json({ rate: { ...rate, price: num(rate.price) } }, { status: 201 });
}
