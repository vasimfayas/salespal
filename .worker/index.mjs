// worker/index.mts
import { Worker } from "bullmq";

// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
var globalForPrisma = globalThis;
var prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
});
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// lib/report-queue.ts
import { Queue } from "bullmq";
import IORedis from "ioredis";
var REPORT_QUEUE = "reports";
function redisConnection() {
  return new IORedis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379", { maxRetriesPerRequest: null });
}

// lib/report-pdf.tsx
import path3 from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";

// lib/task-privacy.ts
import { Prisma } from "@prisma/client";

// lib/scoping.ts
async function getManagerSalesmanIds(managerId) {
  const salesmen = await prisma.managerSalesman.findMany({ where: { manager_id: managerId }, select: { salesman_id: true }, distinct: ["salesman_id"] });
  return salesmen.map((item) => item.salesman_id);
}
async function getManagerSalesmanIdsForOrg(managerId, orgId) {
  const salesmen = await prisma.managerSalesman.findMany({ where: { manager_id: managerId, org_id: orgId }, select: { salesman_id: true } });
  return salesmen.map((item) => item.salesman_id);
}

// lib/company-documents.ts
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// types/company.ts
var COMPANY_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;
var companyDocumentMimeTypes = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};
var COMPANY_DOCUMENT_ACCEPT = Object.keys(companyDocumentMimeTypes).map((ext) => `.${ext}`).join(",");
var COMPANY_LOGO_MAX_BYTES = 2 * 1024 * 1024;

// lib/company-documents.ts
var UPLOAD_ROOT = path.join(process.cwd(), "uploads");
function resolveStoredPath(relativePath) {
  const full = path.resolve(UPLOAD_ROOT, relativePath);
  if (!full.startsWith(UPLOAD_ROOT + path.sep)) throw new Error("Invalid file path");
  return full;
}
async function writeStoredFile(relativePath, data) {
  const full = resolveStoredPath(relativePath);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, data);
}
function readDocumentFile(relativePath) {
  return readFile(resolveStoredPath(relativePath));
}

// lib/company-report.ts
import { Prisma as Prisma3 } from "@prisma/client";

// lib/salesman-targets.ts
import { Prisma as Prisma2 } from "@prisma/client";
function todayUtc() {
  const now = /* @__PURE__ */ new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
function parseDateOnly(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date2 = /* @__PURE__ */ new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date2.getTime()) || date2.toISOString().slice(0, 10) !== value) return null;
  return date2;
}
function targetState(target, achieved, amount, today) {
  if (target.closed_at) return "replaced";
  if (target.period_start > today) return "upcoming";
  if (target.period_end >= today) return "active";
  return achieved >= amount ? "achieved" : "missed";
}
async function getTargetAchievements(salesmanIds) {
  if (salesmanIds.length === 0) return /* @__PURE__ */ new Map();
  const rows = await prisma.$queryRaw(Prisma2.sql`
    SELECT t.id, COALESCE(SUM(o.amount), 0)::float8 AS achieved
    FROM salesman_targets t
    LEFT JOIN orders o
      ON o.created_by_id = t.salesman_id
     AND o.status NOT IN ('cancelled', 'revision_requested')
     AND o.created_at >= t.period_start
     AND o.created_at < t.period_end + 1
    WHERE t.salesman_id IN (${Prisma2.join(salesmanIds)})
    GROUP BY t.id
  `);
  return new Map(rows.map((r) => [r.id, Number(r.achieved)]));
}

// types/order.ts
var orderStatusLabels = {
  transit: "Transit",
  delivered: "Delivered",
  completed: "Completed",
  revision_requested: "Revision requested",
  cancelled: "Cancelled"
};
function orderStatusLabel(status) {
  return orderStatusLabels[status] ?? status;
}
var VOID_ORDER_STATUSES = ["cancelled", "revision_requested"];

// types/enquiry.ts
var jobRefNames = {
  ACLE: "Air Clearance",
  AEGN: "Air Export - General",
  AEGP: "Air Export - Groupage",
  AIAE: "Air Import - Air Export",
  AIGN: "Air Import - General",
  AIGP: "Air Import - Groupage",
  AISE: "Air Sea",
  LTPT: "Land Transport",
  RCLE: "Road Clearance",
  REGN: "Road Export - General",
  RIGN: "Road Import - General",
  SCLE: "Sea Clearance",
  SEFL: "Sea Export FCL",
  SEGN: "Sea Export - General",
  SEGP: "Sea Export - Groupage",
  SIAE: "Sea Air",
  SIFL: "Sea Import FCL",
  SIGN: "Sea Import - General",
  SIGP: "Sea Import - Groupage",
  SISE: "Sea Import Sea Export",
  WHST: "Warehouse Storage"
};
var jobRefs = Object.keys(jobRefNames);
var seaContainerTypes = ["20dc", "40dc", "40hc", "20ot", "40ot", "20fr", "40fr", "20rf", "40rf"];
var seaOtherServiceTypes = ["lcl", "ro_ro", "break_bulk"];
var seaServiceTypes = [...seaContainerTypes, ...seaOtherServiceTypes];
var ftlTruckTypes = ["flatbed", "curtain_side", "closed_box", "reefer", "lowbed", "tipper", "light_truck", "pickup"];
var sharedTruckTypes = ["ltl"];
var truckTypes = [...ftlTruckTypes, ...sharedTruckTypes];
var enquiryStatusLabels = {
  sent_to_client: "Sent to client",
  inquiry_received: "Inquiry received",
  with_agent: "With agent",
  quoted: "Quoted",
  revision_requested: "Revision requested",
  confirmed: "Confirmed",
  lost: "Lost"
};
function enquiryRef(id, prefix) {
  return `${prefix ? `${prefix}-` : ""}ENQ-${String(id).padStart(5, "0")}`;
}
var lostReasons = ["high_rate", "late_quote", "dispute", "credit_terms", "other"];
var lostReasonLabels = {
  high_rate: "High rate",
  late_quote: "Late quote",
  dispute: "Dispute",
  credit_terms: "Credit terms",
  other: "Other"
};
var isLostReason = (v) => typeof v === "string" && lostReasons.includes(v);

// lib/agents.ts
function placeCountry(place, places) {
  if (place.includes(",")) return place.split(",").pop().trim().toLowerCase();
  const name = place.replace(/\(.*?\)/g, "").trim().toLowerCase();
  const code = place.match(/\(([A-Za-z]{3,5})\)/)?.[1]?.toLowerCase();
  const hit = places.find((l) => l.name.toLowerCase() === name || !!code && l.code?.toLowerCase() === code || l.aliases?.some((x) => x.toLowerCase() === name));
  return hit?.country.toLowerCase() ?? "";
}

// lib/report-parts.ts
var reportParts = ["orders", "enquiries", "confirmed", "lost"];

// lib/locations.ts
var COUNTRIES = [
  // ── Gulf & Middle East ──
  {
    country: "Qatar",
    code: "QA",
    ports: [["Hamad Port", "QAHMD", ["doha", "new port"]], ["Doha Port", "QADOH"], ["Mesaieed Port", "QAMES", ["umm said"]], ["Ras Laffan Port", "QARLF"]],
    airports: [["Hamad International Airport", "DOH", ["doha"]]],
    land: [["Abu Samra Border", ["salwa", "saudi border"]], ["Doha", ["doha city"]], ["Mesaieed Industrial City"], ["Ras Laffan Industrial City"]]
  },
  {
    country: "United Arab Emirates",
    code: "AE",
    aliases: ["uae", "emirates"],
    ports: [["Jebel Ali", "AEJEA", ["dubai"]], ["Port Rashid", "AEPRA", ["dubai"]], ["Khalifa Port", "AEKHL", ["abu dhabi"]], ["Mina Zayed", "AEMZD", ["abu dhabi"]], ["Port Khalid", "AESHJ", ["sharjah"]], ["Khor Fakkan", "AEKLF"], ["Fujairah", "AEFJR"]],
    airports: [["Dubai International Airport", "DXB"], ["Dubai World Central", "DWC", ["al maktoum"]], ["Abu Dhabi International Airport", "AUH"], ["Sharjah International Airport", "SHJ"]],
    land: [["Ghuwaifat Border", ["saudi border"]], ["Dubai"], ["Abu Dhabi"], ["Sharjah"]]
  },
  {
    country: "Saudi Arabia",
    code: "SA",
    aliases: ["ksa"],
    ports: [["Jeddah Islamic Port", "SAJED"], ["King Abdulaziz Port", "SADMM", ["dammam"]], ["Jubail Commercial Port", "SAJUB"], ["King Abdullah Port", "SAKAC", ["rabigh"]], ["Yanbu Commercial Port", "SAYNB"]],
    airports: [["King Khalid International Airport", "RUH", ["riyadh"]], ["King Abdulaziz International Airport", "JED", ["jeddah"]], ["King Fahd International Airport", "DMM", ["dammam"]]],
    land: [["Salwa Border", ["qatar border", "abu samra"]], ["Riyadh"], ["Dammam"], ["Jeddah"], ["King Fahd Causeway", ["bahrain"]]]
  },
  {
    country: "Oman",
    code: "OM",
    ports: [["Sohar Port", "OMSOH"], ["Port of Salalah", "OMSLL"], ["Port Sultan Qaboos", "OMMCT", ["muscat"]], ["Port of Duqm", "OMDQM"]],
    airports: [["Muscat International Airport", "MCT"]],
    land: [["Muscat"], ["Sohar"]]
  },
  {
    country: "Kuwait",
    code: "KW",
    ports: [["Shuwaikh Port", "KWSWK"], ["Shuaiba Port", "KWSAA"]],
    airports: [["Kuwait International Airport", "KWI"]],
    land: [["Kuwait City"]]
  },
  {
    country: "Bahrain",
    code: "BH",
    ports: [["Khalifa Bin Salman Port", "BHKBS"]],
    airports: [["Bahrain International Airport", "BAH"]],
    land: [["Manama"]]
  },
  { country: "Iraq", code: "IQ", ports: [["Umm Qasr", "IQUQR"]], airports: [["Basra International Airport", "BSR"], ["Baghdad International Airport", "BGW"]] },
  { country: "Jordan", code: "JO", ports: [["Aqaba", "JOAQJ"]], airports: [["Queen Alia International Airport", "AMM", ["amman"]]], land: [["Amman"]] },
  {
    country: "Egypt",
    code: "EG",
    ports: [["Port Said", "EGPSD"], ["Alexandria", "EGALY"], ["Ain Sokhna", "EGSOK"], ["Damietta", "EGDAM"]],
    airports: [["Cairo International Airport", "CAI"]]
  },
  {
    country: "Turkey",
    code: "TR",
    aliases: ["turkiye"],
    ports: [["Mersin", "TRMER"], ["Ambarli", "TRAMR", ["istanbul"]], ["Izmir", "TRIZM"]],
    airports: [["Istanbul Airport", "IST"]]
  },
  // ── South Asia ──
  {
    country: "India",
    code: "IN",
    ports: [["Nhava Sheva (JNPT)", "INNSA", ["jnpt", "mumbai", "jawaharlal nehru"]], ["Mundra", "INMUN"], ["Chennai", "INMAA", ["madras"]], ["Kolkata", "INCCU", ["calcutta"]], ["Cochin", "INCOK", ["kochi"]], ["Visakhapatnam", "INVTZ", ["vizag"]], ["Tuticorin", "INTUT"]],
    airports: [["Mumbai Airport", "BOM"], ["Delhi Airport", "DEL", ["new delhi"]], ["Chennai Airport", "MAA"], ["Bengaluru Airport", "BLR", ["bangalore"]], ["Hyderabad Airport", "HYD"], ["Kochi Airport", "COK", ["cochin"]]]
  },
  {
    country: "Pakistan",
    code: "PK",
    ports: [["Karachi", "PKKHI"], ["Port Qasim", "PKBQM"]],
    airports: [["Karachi Airport", "KHI"], ["Lahore Airport", "LHE"]]
  },
  { country: "Sri Lanka", code: "LK", ports: [["Colombo", "LKCMB"]], airports: [["Colombo Airport", "CMB", ["bandaranaike"]]] },
  { country: "Bangladesh", code: "BD", ports: [["Chittagong", "BDCGP", ["chattogram"]]], airports: [["Dhaka Airport", "DAC"]] },
  // ── East & Southeast Asia ──
  {
    country: "China",
    code: "CN",
    ports: [["Shanghai", "CNSHA"], ["Ningbo", "CNNGB"], ["Yantian", "CNYTN", ["shenzhen"]], ["Shekou", "CNSHK", ["shenzhen"]], ["Nansha", "CNNSA", ["guangzhou"]], ["Qingdao", "CNTAO"], ["Tianjin (Xingang)", "CNTXG"], ["Xiamen", "CNXMN"], ["Dalian", "CNDLC"]],
    airports: [["Shanghai Pudong Airport", "PVG"], ["Beijing Capital Airport", "PEK"], ["Guangzhou Baiyun Airport", "CAN"], ["Shenzhen Airport", "SZX"]]
  },
  { country: "Hong Kong", code: "HK", ports: [["Hong Kong", "HKHKG"]], airports: [["Hong Kong International Airport", "HKG"]] },
  { country: "Taiwan", code: "TW", ports: [["Kaohsiung", "TWKHH"]], airports: [["Taoyuan International Airport", "TPE", ["taipei"]]] },
  { country: "South Korea", code: "KR", aliases: ["korea"], ports: [["Busan", "KRPUS", ["pusan"]], ["Incheon", "KRINC"]], airports: [["Incheon International Airport", "ICN", ["seoul"]]] },
  {
    country: "Japan",
    code: "JP",
    ports: [["Tokyo", "JPTYO"], ["Yokohama", "JPYOK"], ["Kobe", "JPUKB"], ["Nagoya", "JPNGO"]],
    airports: [["Narita International Airport", "NRT", ["tokyo"]], ["Kansai International Airport", "KIX", ["osaka"]]]
  },
  { country: "Singapore", code: "SG", ports: [["Singapore", "SGSIN"]], airports: [["Changi Airport", "SIN", ["singapore"]]] },
  {
    country: "Malaysia",
    code: "MY",
    ports: [["Port Klang", "MYPKG"], ["Tanjung Pelepas", "MYTPP"], ["Penang", "MYPEN"]],
    airports: [["Kuala Lumpur International Airport", "KUL"]]
  },
  { country: "Thailand", code: "TH", ports: [["Laem Chabang", "THLCH"], ["Bangkok", "THBKK"]], airports: [["Suvarnabhumi Airport", "BKK", ["bangkok"]]] },
  {
    country: "Vietnam",
    code: "VN",
    aliases: ["viet nam"],
    ports: [["Ho Chi Minh City (Cat Lai)", "VNSGN", ["saigon"]], ["Hai Phong", "VNHPH"]],
    airports: [["Tan Son Nhat Airport", "SGN", ["ho chi minh"]], ["Noi Bai Airport", "HAN", ["hanoi"]]]
  },
  { country: "Indonesia", code: "ID", ports: [["Jakarta (Tanjung Priok)", "IDJKT"], ["Surabaya", "IDSUB"]], airports: [["Soekarno-Hatta Airport", "CGK", ["jakarta"]]] },
  { country: "Philippines", code: "PH", ports: [["Manila", "PHMNL"]], airports: [["Ninoy Aquino Airport", "MNL", ["manila"]]] },
  // ── Europe ──
  { country: "Germany", code: "DE", ports: [["Hamburg", "DEHAM"], ["Bremerhaven", "DEBRV"]], airports: [["Frankfurt Airport", "FRA"]] },
  { country: "Netherlands", code: "NL", aliases: ["holland"], ports: [["Rotterdam", "NLRTM"]], airports: [["Amsterdam Schiphol Airport", "AMS"]] },
  { country: "Belgium", code: "BE", ports: [["Antwerp", "BEANR"]], airports: [["Brussels Airport", "BRU"], ["Li\xE8ge Airport", "LGG"]] },
  {
    country: "United Kingdom",
    code: "GB",
    aliases: ["uk", "england", "britain"],
    ports: [["Felixstowe", "GBFXT"], ["Southampton", "GBSOU"], ["London Gateway", "GBLGP"]],
    airports: [["London Heathrow Airport", "LHR"]]
  },
  { country: "France", code: "FR", ports: [["Le Havre", "FRLEH"], ["Marseille", "FRMRS"]], airports: [["Paris Charles de Gaulle Airport", "CDG"]] },
  { country: "Spain", code: "ES", ports: [["Valencia", "ESVLC"], ["Algeciras", "ESALG"], ["Barcelona", "ESBCN"]], airports: [["Madrid Barajas Airport", "MAD"]] },
  { country: "Italy", code: "IT", ports: [["Genoa", "ITGOA"], ["La Spezia", "ITSPE"], ["Gioia Tauro", "ITGIT"]], airports: [["Milan Malpensa Airport", "MXP"]] },
  { country: "Greece", code: "GR", ports: [["Piraeus", "GRPIR"]], airports: [["Athens Airport", "ATH"]] },
  // ── Africa ──
  { country: "South Africa", code: "ZA", ports: [["Durban", "ZADUR"], ["Cape Town", "ZACPT"]], airports: [["Johannesburg O. R. Tambo Airport", "JNB"]] },
  { country: "Kenya", code: "KE", ports: [["Mombasa", "KEMBA"]], airports: [["Nairobi Jomo Kenyatta Airport", "NBO"]] },
  { country: "Tanzania", code: "TZ", ports: [["Dar es Salaam", "TZDAR"]] },
  { country: "Djibouti", code: "DJ", ports: [["Djibouti", "DJJIB"]] },
  { country: "Nigeria", code: "NG", ports: [["Lagos (Apapa)", "NGAPP"]], airports: [["Lagos Murtala Muhammed Airport", "LOS"]] },
  { country: "Morocco", code: "MA", ports: [["Tanger Med", "MAPTM"]], airports: [["Casablanca Mohammed V Airport", "CMN"]] },
  // ── Americas & Oceania ──
  {
    country: "United States",
    code: "US",
    aliases: ["usa", "america"],
    ports: [["Los Angeles", "USLAX"], ["Long Beach", "USLGB"], ["New York / New Jersey", "USNYC"], ["Savannah", "USSAV"], ["Houston", "USHOU"]],
    airports: [["New York JFK Airport", "JFK"], ["Los Angeles Airport", "LAX"], ["Chicago O'Hare Airport", "ORD"], ["Miami Airport", "MIA"]]
  },
  { country: "Canada", code: "CA", ports: [["Vancouver", "CAVAN"]], airports: [["Toronto Pearson Airport", "YYZ"]] },
  { country: "Brazil", code: "BR", ports: [["Santos", "BRSSZ"]], airports: [["S\xE3o Paulo Guarulhos Airport", "GRU"]] },
  { country: "Australia", code: "AU", ports: [["Melbourne", "AUMEL"], ["Sydney", "AUSYD"]], airports: [["Sydney Airport", "SYD"]] }
];
var SEED_LOCATIONS = COUNTRIES.flatMap((c) => {
  const base = { country: c.country, countryCode: c.code };
  const withCountryAliases = (aliases) => [...aliases ?? [], ...c.aliases ?? []];
  return [
    ...(c.ports ?? []).map(([name, code, aliases]) => ({ ...base, name, code, kind: "port", aliases: withCountryAliases(aliases) })),
    ...(c.airports ?? []).map(([name, code, aliases]) => ({ ...base, name, code, kind: "airport", aliases: withCountryAliases(aliases) })),
    ...(c.land ?? []).map(([name, aliases]) => ({ ...base, name, kind: "land", aliases: withCountryAliases(aliases) }))
  ];
});
var placeSearch = (l) => [l.name, l.code, l.country, l.countryCode, ...l.aliases ?? []].filter(Boolean).join(" ").toLowerCase();

// lib/locations-db.ts
async function getLocations() {
  if (await prisma.location.count() === 0) {
    await prisma.location.createMany({
      data: SEED_LOCATIONS.map((l) => ({ name: l.name, code: l.code ?? null, kind: l.kind, country: l.country, country_code: l.countryCode, aliases: l.aliases ?? [] })),
      skipDuplicates: true
    });
  }
  const rows = await prisma.location.findMany({ orderBy: [{ country: "asc" }, { kind: "asc" }, { name: "asc" }] });
  return rows.map((r) => {
    const l = { name: r.name, code: r.code ?? void 0, kind: r.kind, country: r.country, countryCode: r.country_code, aliases: r.aliases };
    return { ...l, id: r.id, search: placeSearch(l) };
  });
}

// lib/company-report.ts
var DETAIL_LIMIT = 500;
var n = (v) => Number(v ?? 0);
function parseRange(fromValue, toValue) {
  const from = parseDateOnly(fromValue);
  const to = parseDateOnly(toValue);
  if (!from || !to || from > to) return null;
  return { from, to, end: new Date(to.getTime() + 864e5) };
}
var DEFAULT_PARTS = ["orders", "enquiries", "lost"];
var text = (v) => typeof v === "string" && v.trim() ? v.trim().slice(0, 80) : null;
function parseFilters(body) {
  const staff = Array.isArray(body.staff) ? [...new Set(body.staff.map(Number).filter((x) => Number.isInteger(x) && x > 0))].slice(0, 200) : [];
  const parts = reportParts.filter((x) => Array.isArray(body.parts) && body.parts.includes(x));
  return {
    staff,
    mode: ["sea", "air", "land"].includes(body.mode) ? body.mode : null,
    fromCountry: text(body.from_country),
    toCountry: text(body.to_country),
    parts: parts.length ? parts : DEFAULT_PARTS
  };
}
async function placesIn(country, orgId) {
  const [rows, places] = await Promise.all([
    prisma.$queryRaw(Prisma3.sql`
      SELECT "from" AS v FROM enquiries WHERE org_id = ${orgId} UNION SELECT "to" FROM enquiries WHERE org_id = ${orgId}
      UNION SELECT "from" FROM orders WHERE org_id = ${orgId} UNION SELECT "to" FROM orders WHERE org_id = ${orgId}`),
    getLocations()
  ]);
  const want = country.toLowerCase();
  return rows.map((r) => r.v).filter((v) => placeCountry(v, places) === want);
}
async function getCompanyReport(orgId, range, viewer, f = parseFilters({})) {
  const { from, end } = range;
  const day = (d) => Prisma3.sql`${d.toISOString().slice(0, 10)}::date`;
  const [S, E] = [day(from), day(end)];
  const voided = Prisma3.join([...VOID_ORDER_STATUSES]);
  const [fromPlaces, toPlaces] = await Promise.all([f.fromCountry ? placesIn(f.fromCountry, orgId) : null, f.toCountry ? placesIn(f.toCountry, orgId) : null]);
  const inList = (col, list) => list ? list.length ? Prisma3.sql`AND ${Prisma3.raw(col)} IN (${Prisma3.join(list)})` : Prisma3.sql`AND FALSE` : Prisma3.empty;
  const fo = (a) => Prisma3.sql`${f.staff.length ? Prisma3.sql`AND ${Prisma3.raw(a)}.created_by_id IN (${Prisma3.join(f.staff)})` : Prisma3.empty} ${f.mode ? Prisma3.sql`AND ${Prisma3.raw(a)}.mode = ${f.mode}` : Prisma3.empty} ${inList(`${a}."from"`, fromPlaces)} ${inList(`${a}."to"`, toPlaces)}`;
  const [org, orderAgg, actualAgg, enquiryAgg, lostAgg, orders, enquiries, lostItems, sellers, confirmedItems] = await Promise.all([
    prisma.organization.findUnique({ where: { id: orgId }, select: { name: true, prefix: true, logo_path: true, address: true, phone: true, email: true } }),
    prisma.$queryRaw(Prisma3.sql`
      SELECT o.created_by_id AS by,
             COUNT(*) FILTER (WHERE o.status NOT IN (${voided}))::int AS count,
             COALESCE(SUM(o.amount) FILTER (WHERE o.status NOT IN (${voided})), 0)::float8 AS value,
             COALESCE(SUM(e.provisional_profit) FILTER (WHERE o.status NOT IN (${voided})), 0)::float8 AS profit,
             COUNT(*) FILTER (WHERE o.status IN (${voided}))::int AS voided
      FROM orders o LEFT JOIN enquiries e ON e.id = o.enquiry_id
      WHERE o.org_id = ${orgId} AND o.created_at >= ${S} AND o.created_at < ${E} ${fo("o")}
      GROUP BY 1`),
    prisma.$queryRaw(Prisma3.sql`
      SELECT o.created_by_id AS by, COUNT(*)::int AS count,
             COALESCE(SUM(e.actual_cost), 0)::float8 AS cost, COALESCE(SUM(e.actual_profit), 0)::float8 AS profit
      FROM orders o JOIN enquiries e ON e.id = o.enquiry_id
      WHERE o.org_id = ${orgId} AND o.status NOT IN (${voided}) AND e.actual_profit IS NOT NULL
        AND o.invoice_date >= ${S} AND o.invoice_date < ${E} ${fo("o")}
      GROUP BY 1`),
    prisma.$queryRaw(Prisma3.sql`
      SELECT e.created_by_id AS by, COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE e.status = 'confirmed')::int AS confirmed,
             COUNT(*) FILTER (WHERE e.status = 'lost')::int AS lost,
             COALESCE(SUM(e.provisional_cost + e.provisional_profit), 0)::float8 AS quoted
      FROM enquiries e
      WHERE e.org_id = ${orgId} AND e.enquiry_date >= ${S} AND e.enquiry_date < ${E} ${fo("e")}
      GROUP BY 1`),
    // A lost enquiry whose order was cancelled counts as a lost order.
    prisma.$queryRaw(Prisma3.sql`
      SELECT e.created_by_id AS by, COALESCE(e.lost_reason, '') AS reason,
             EXISTS (SELECT 1 FROM orders o WHERE o.origin_enquiry_id = e.id AND o.status = 'cancelled') AS is_order,
             COUNT(*)::int AS count, COALESCE(SUM(e.provisional_cost + e.provisional_profit), 0)::float8 AS value
      FROM enquiries e
      WHERE e.org_id = ${orgId} AND e.status = 'lost' AND e.cancelled_at >= ${S} AND e.cancelled_at < ${E} ${fo("e")}
      GROUP BY 1, 2, 3`),
    prisma.$queryRaw(Prisma3.sql`
      SELECT o.id, o.job_no, COALESCE(o.enquiry_id, o.origin_enquiry_id) AS enquiry_id, o.created_at, c.name AS client, u.name AS by,
             o.mode, o."from", o."to", o.status, o.amount::float8 AS amount, e.provisional_profit::float8 AS profit,
             e.actual_profit::float8 AS actual_profit
      FROM orders o
      JOIN clients c ON c.id = o.client_id
      JOIN users u ON u.id = o.created_by_id
      LEFT JOIN enquiries e ON e.id = o.enquiry_id
      WHERE o.org_id = ${orgId} AND o.created_at >= ${S} AND o.created_at < ${E} ${fo("o")}
      ORDER BY o.created_at, o.id LIMIT ${DETAIL_LIMIT + 1}`),
    prisma.$queryRaw(Prisma3.sql`
      SELECT e.id, e.enquiry_date, c.name AS client, u.name AS by, e.mode, e."from", e."to", e.status,
             (e.provisional_cost + e.provisional_profit)::float8 AS quoted, e.provisional_profit::float8 AS profit
      FROM enquiries e
      JOIN clients c ON c.id = e.client_id
      JOIN users u ON u.id = e.created_by_id
      WHERE e.org_id = ${orgId} AND e.enquiry_date >= ${S} AND e.enquiry_date < ${E} ${fo("e")}
      ORDER BY e.enquiry_date, e.id LIMIT ${DETAIL_LIMIT + 1}`),
    prisma.$queryRaw(Prisma3.sql`
      SELECT e.id, c.name AS client, u.name AS by, e."from", e."to", e.lost_reason AS reason, e.cancel_reason AS text,
             EXISTS (SELECT 1 FROM orders o WHERE o.origin_enquiry_id = e.id AND o.status = 'cancelled') AS is_order,
             e.cancelled_at AS lost_at, (e.provisional_cost + e.provisional_profit)::float8 AS value
      FROM enquiries e
      JOIN clients c ON c.id = e.client_id
      JOIN users u ON u.id = e.created_by_id
      WHERE e.org_id = ${orgId} AND e.status = 'lost' AND e.cancelled_at >= ${S} AND e.cancelled_at < ${E} ${fo("e")}
      ORDER BY e.cancelled_at, e.id LIMIT ${DETAIL_LIMIT + 1}`),
    prisma.managerSalesman.findMany({ where: { org_id: orgId }, select: { salesman_id: true }, distinct: ["salesman_id"] }),
    prisma.$queryRaw(Prisma3.sql`
      SELECT e.id, e.enquiry_date, c.name AS client, u.name AS by, e.mode, e."from", e."to", e.status,
             (e.provisional_cost + e.provisional_profit)::float8 AS quoted, e.provisional_profit::float8 AS profit
      FROM enquiries e
      JOIN clients c ON c.id = e.client_id
      JOIN users u ON u.id = e.created_by_id
      WHERE e.org_id = ${orgId} AND e.status = 'confirmed' AND e.enquiry_date >= ${S} AND e.enquiry_date < ${E} ${fo("e")}
      ORDER BY e.enquiry_date, e.id LIMIT ${DETAIL_LIMIT + 1}`)
  ]);
  if (!org) return null;
  let staffIds = [.../* @__PURE__ */ new Set([...sellers.map((x) => x.salesman_id), ...orderAgg.map((r) => r.by), ...actualAgg.map((r) => r.by), ...enquiryAgg.map((r) => r.by), ...lostAgg.map((r) => r.by)])];
  if (f.staff.length) staffIds = staffIds.filter((id) => f.staff.includes(id));
  if (viewer.role_id === 2) {
    const team = /* @__PURE__ */ new Set([...await getManagerSalesmanIdsForOrg(viewer.id, orgId), ...await getManagerSalesmanIds(viewer.id)]);
    staffIds = staffIds.filter((id) => team.has(id));
  }
  const [users, targets, achieved] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: staffIds } }, select: { id: true, name: true, role_id: true } }),
    // The target running during the range: the latest one overlapping it that wasn't replaced.
    prisma.salesmanTarget.findMany({
      where: { salesman_id: { in: staffIds }, closed_at: null, period_start: { lt: end }, period_end: { gte: from } },
      orderBy: [{ period_start: "desc" }, { id: "desc" }]
    }),
    getTargetAchievements(staffIds)
  ]);
  const today = todayUtc();
  const staff = users.map((u) => {
    const o = orderAgg.find((r) => r.by === u.id);
    const a = actualAgg.find((r) => r.by === u.id);
    const e = enquiryAgg.find((r) => r.by === u.id);
    const t = targets.find((x) => x.salesman_id === u.id);
    const target = t ? (() => {
      const amount = Number(t.amount);
      const done = achieved.get(t.id) ?? 0;
      return { amount, achieved: done, percent: amount > 0 ? done / amount * 100 : 0, start: t.period_start, end: t.period_end, state: targetState(t, done, amount, today) };
    })() : null;
    return {
      id: u.id,
      name: u.name,
      isSalesman: u.role_id === 3,
      orders: n(o?.count ?? 0),
      value: n(o?.value ?? 0),
      profit: n(o?.profit ?? 0),
      actualProfit: n(a?.profit ?? 0),
      enquiries: n(e?.total ?? 0),
      confirmed: n(e?.confirmed ?? 0),
      lost: lostAgg.filter((r) => r.by === u.id).reduce((a2, r) => a2 + n(r.count), 0),
      target
    };
  }).sort((a, b) => b.profit - a.profit || b.value - a.value || a.name.localeCompare(b.name));
  const sum = (rows, f2) => rows.reduce((a, r) => a + n(f2(r)), 0);
  const lostCount = sum(lostAgg, (r) => r.count);
  const reasonKey = (r) => isLostReason(r) ? r : "";
  const reasons = [...lostReasons, ""].map((key) => {
    const rows = lostAgg.filter((r) => reasonKey(r.reason) === key);
    return {
      reason: key ? lostReasonLabels[key] : "Not categorised",
      enquiries: sum(rows.filter((r) => !r.is_order), (r) => r.count),
      orders: sum(rows.filter((r) => r.is_order), (r) => r.count),
      count: sum(rows, (r) => r.count),
      value: sum(rows, (r) => r.value)
    };
  }).filter((r) => r.count > 0 || r.reason !== "Not categorised").sort((a, b) => b.count - a.count);
  const enquiryTotal = sum(enquiryAgg, (r) => r.total);
  const confirmed = sum(enquiryAgg, (r) => r.confirmed);
  const cut = (rows) => ({ rows: rows.slice(0, DETAIL_LIMIT), truncated: rows.length > DETAIL_LIMIT });
  return {
    org,
    from: range.from,
    to: range.to,
    generatedAt: /* @__PURE__ */ new Date(),
    summary: {
      orders: sum(orderAgg, (r) => r.count),
      orderValue: sum(orderAgg, (r) => r.value),
      profit: sum(orderAgg, (r) => r.profit),
      actualProfit: sum(actualAgg, (r) => r.profit),
      actualCost: sum(actualAgg, (r) => r.cost),
      invoiced: sum(actualAgg, (r) => r.count),
      voidedOrders: sum(orderAgg, (r) => r.voided),
      enquiries: enquiryTotal,
      confirmed,
      quoted: sum(enquiryAgg, (r) => r.quoted),
      conversion: enquiryTotal > 0 ? confirmed / enquiryTotal * 100 : null,
      lost: lostCount,
      lostEnquiries: sum(lostAgg.filter((r) => !r.is_order), (r) => r.count),
      lostOrders: sum(lostAgg.filter((r) => r.is_order), (r) => r.count),
      lostValue: sum(lostAgg, (r) => r.value),
      reasons
    },
    filters: f,
    // What the report was narrowed to, in words (shown under the title); empty for an unfiltered report.
    filterNotes: [
      f.staff.length ? `Staff: ${users.filter((u) => f.staff.includes(u.id)).map((u) => u.name).join(", ") || "none found"}` : null,
      f.mode ? `Mode: ${f.mode}` : null,
      f.fromCountry ? `From: ${f.fromCountry}` : null,
      f.toCountry ? `To: ${f.toCountry}` : null
    ].filter((x) => !!x),
    staff,
    details: {
      confirmed: cut(confirmedItems.map((r) => ({ ...r, quoted: r.quoted === null ? null : n(r.quoted), profit: r.profit === null ? null : n(r.profit) }))),
      orders: cut(
        orders.map((r) => ({ ...r, amount: n(r.amount), profit: r.profit === null ? null : n(r.profit), actual_profit: r.actual_profit === null ? null : n(r.actual_profit) }))
      ),
      enquiries: cut(enquiries.map((r) => ({ ...r, quoted: r.quoted === null ? null : n(r.quoted), profit: r.profit === null ? null : n(r.profit) }))),
      lost: cut(lostItems.map((r) => ({ ...r, value: r.value === null ? null : n(r.value) })))
    }
  };
}

// components/reports/CompanyReportPdf.tsx
import { Document, Image, Page, Text as Text2, View as View2 } from "@react-pdf/renderer";

// components/reports/pdf-kit.tsx
import path2 from "node:path";
import { Font, StyleSheet, Text, View } from "@react-pdf/renderer";
import { jsx, jsxs } from "react/jsx-runtime";
var fontDir = path2.join(process.cwd(), "node_modules/@fontsource/inter/files");
Font.register({
  family: "Inter",
  fonts: [400, 500, 600, 700, 800].map((fontWeight) => ({ src: path2.join(fontDir, `inter-latin-${fontWeight}-normal.woff`), fontWeight }))
});
Font.registerHyphenationCallback((word) => [word]);
var C = {
  ink: "#0F172A",
  body: "#334155",
  muted: "#64748B",
  faint: "#94A3B8",
  line: "#E2E8F0",
  subtle: "#F8FAFC",
  primary: "#059669",
  primaryDark: "#064E3B",
  primarySoft: "#ECFDF5",
  danger: "#DC2626",
  dangerSoft: "#FEF2F2",
  warning: "#D97706",
  info: "#2563EB"
};
var s = StyleSheet.create({
  page: { fontFamily: "Inter", fontSize: 9, color: C.body, paddingTop: 32, paddingBottom: 48, paddingHorizontal: 36, backgroundColor: "#FFFFFF" },
  hero: { backgroundColor: C.primaryDark, borderRadius: 14, padding: 22, flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  eyebrow: { fontSize: 7.5, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: "#6EE7B7" },
  heroTitle: { fontSize: 22, fontWeight: 800, color: "#FFFFFF", marginTop: 6 },
  heroSub: { fontSize: 10, color: "#D1FAE5", marginTop: 3 },
  heroRight: { alignItems: "flex-end", justifyContent: "flex-end", maxWidth: 220 },
  heroName: { fontSize: 13, fontWeight: 700, color: "#FFFFFF", textAlign: "right" },
  heroMeta: { fontSize: 8, color: "#A7F3D0", marginTop: 2, textAlign: "right" },
  row: { flexDirection: "row", gap: 8 },
  kpi: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 10, backgroundColor: "#FFFFFF" },
  kpiLabel: { fontSize: 7, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6 },
  kpiValue: { fontSize: 17, fontWeight: 800, color: C.ink, marginTop: 4 },
  kpiFoot: { fontSize: 7, color: C.muted, marginTop: 3 },
  section: { marginTop: 18 },
  sectionHead: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 6 },
  sectionBar: { width: 3, height: 12, borderRadius: 2, backgroundColor: C.primary },
  sectionTitle: { fontSize: 11.5, fontWeight: 700, color: C.ink },
  sectionNote: { fontSize: 7.5, color: C.muted, marginLeft: "auto" },
  card: { borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 12 },
  insight: { backgroundColor: C.primarySoft, borderRadius: 10, padding: 12, marginTop: 12 },
  insightText: { fontSize: 9, lineHeight: 1.55, color: "#065F46" },
  table: { borderWidth: 1, borderColor: C.line, borderRadius: 10, overflow: "hidden" },
  th: { flexDirection: "row", backgroundColor: C.subtle, borderBottomWidth: 1, borderBottomColor: C.line, paddingVertical: 6, paddingHorizontal: 10 },
  thText: { fontSize: 7, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 },
  tr: { flexDirection: "row", paddingVertical: 4.5, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  td: { fontSize: 8.5, color: C.body },
  tdStrong: { fontSize: 8.5, fontWeight: 600, color: C.ink },
  num: { textAlign: "right" },
  track: { height: 6, borderRadius: 3, backgroundColor: "#F1F5F9", overflow: "hidden" },
  empty: { fontSize: 8.5, color: C.muted, paddingVertical: 10, textAlign: "center" },
  footer: { position: "absolute", bottom: 20, left: 36, right: 36, flexDirection: "row", justifyContent: "space-between", fontSize: 7, color: C.faint, borderTopWidth: 1, borderTopColor: C.line, paddingTop: 6 }
});
var money = (v) => new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
var compact = (v) => Math.abs(v) >= 1e5 ? new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(v) : money(v);
var int = (v) => new Intl.NumberFormat("en").format(v);
var pct = (v, digits = 0) => v === null ? "\u2014" : `${v.toFixed(digits)}%`;
var date = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
var title = (v) => v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
function Section({ title: heading, note, children, breakBefore }) {
  return /* @__PURE__ */ jsxs(View, { style: s.section, break: breakBefore, children: [
    /* @__PURE__ */ jsxs(View, { style: s.sectionHead, minPresenceAhead: 60, children: [
      /* @__PURE__ */ jsx(View, { style: s.sectionBar }),
      /* @__PURE__ */ jsx(Text, { style: s.sectionTitle, children: heading }),
      note ? /* @__PURE__ */ jsx(Text, { style: s.sectionNote, children: note }) : null
    ] }),
    children
  ] });
}
function Kpi({ label, value, foot, accent, children }) {
  return /* @__PURE__ */ jsxs(View, { style: [s.kpi, accent ? { borderTopWidth: 3, borderTopColor: accent } : {}], children: [
    /* @__PURE__ */ jsx(Text, { style: s.kpiLabel, children: label }),
    /* @__PURE__ */ jsx(Text, { style: s.kpiValue, children: value }),
    foot ? /* @__PURE__ */ jsx(Text, { style: s.kpiFoot, children: foot }) : null,
    children
  ] });
}
function Bar({ value, max, color, height = 6 }) {
  const width = max > 0 ? Math.max(value / max * 100, value > 0 ? 2 : 0) : 0;
  return /* @__PURE__ */ jsx(View, { style: [s.track, { height, borderRadius: height / 2 }], children: /* @__PURE__ */ jsx(View, { style: { width: `${width}%`, height, borderRadius: height / 2, backgroundColor: color } }) });
}
function Table({ cols, rows, empty }) {
  return /* @__PURE__ */ jsxs(View, { style: s.table, children: [
    /* @__PURE__ */ jsx(View, { style: s.th, fixed: true, children: cols.map((c) => /* @__PURE__ */ jsx(Text, { style: [s.thText, { width: c.width }, c.align === "right" ? s.num : {}], children: c.label }, c.label)) }),
    rows.length === 0 ? /* @__PURE__ */ jsx(Text, { style: s.empty, children: empty }) : rows.map((row, i) => /* @__PURE__ */ jsx(View, { style: [s.tr, i === rows.length - 1 ? { borderBottomWidth: 0 } : {}], wrap: false, children: cols.map((c) => /* @__PURE__ */ jsx(View, { style: { width: c.width, paddingRight: c.align === "right" ? 0 : 6 }, children: /* @__PURE__ */ jsx(Text, { style: [c.strong ? s.tdStrong : s.td, c.align === "right" ? s.num : {}], children: c.render(row) }) }, c.label)) }, i))
  ] });
}

// components/reports/CompanyReportPdf.tsx
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var TARGET_STATE = {
  active: { label: "In progress", color: C.info },
  upcoming: { label: "Upcoming", color: C.muted },
  achieved: { label: "Achieved", color: C.primary },
  missed: { label: "Missed", color: C.danger },
  replaced: { label: "Replaced", color: C.muted }
};
function Footer({ r }) {
  return /* @__PURE__ */ jsxs2(View2, { style: s.footer, fixed: true, children: [
    /* @__PURE__ */ jsxs2(Text2, { children: [
      r.org.name,
      " \xB7 ",
      date(r.from),
      " \u2013 ",
      date(r.to),
      " \xB7 Generated ",
      date(r.generatedAt)
    ] }),
    /* @__PURE__ */ jsx2(Text2, { render: ({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}` })
  ] });
}
var Cut = ({ show }) => show ? /* @__PURE__ */ jsx2(Text2, { style: { fontSize: 7.5, color: C.warning, marginTop: 4 }, children: "Showing the first 500 rows. Pick a shorter date range to see them all." }) : null;
function CompanyReportPdf({ report: r, logo }) {
  const t = r.summary;
  const reasonMax = Math.max(...t.reasons.map((x) => x.count), 1);
  const ref = (id) => id ? enquiryRef(id, r.org.prefix) : "\u2014";
  const range = `${date(r.from)} \u2013 ${date(r.to)}`;
  const shown = r.filters.parts;
  return /* @__PURE__ */ jsxs2(Document, { title: `${r.org.name} \u2014 report ${range}`, author: "SalesPal", subject: "Company performance report", children: [
    /* @__PURE__ */ jsxs2(Page, { size: "A4", style: s.page, children: [
      /* @__PURE__ */ jsxs2(View2, { style: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }, children: [
        logo ? /* @__PURE__ */ jsx2(Image, { src: logo, style: { maxHeight: 56, maxWidth: 200, objectFit: "contain" } }) : /* @__PURE__ */ jsx2(Text2, { style: { fontSize: 16, fontWeight: 800, color: C.ink }, children: r.org.name }),
        /* @__PURE__ */ jsx2(View2, { style: { alignItems: "flex-end", maxWidth: 240 }, children: [r.org.address, r.org.phone, r.org.email].filter(Boolean).map((line) => /* @__PURE__ */ jsx2(Text2, { style: { fontSize: 7.5, color: C.muted, textAlign: "right" }, children: line }, line)) })
      ] }),
      /* @__PURE__ */ jsx2(View2, { style: s.hero, children: /* @__PURE__ */ jsxs2(View2, { children: [
        /* @__PURE__ */ jsx2(Text2, { style: s.eyebrow, children: "Company report \xB7 Overall summary" }),
        /* @__PURE__ */ jsx2(Text2, { style: s.heroTitle, children: r.org.name }),
        /* @__PURE__ */ jsx2(Text2, { style: s.heroSub, children: range }),
        r.filterNotes.length > 0 && /* @__PURE__ */ jsxs2(Text2, { style: [s.heroSub, { marginTop: 3 }], children: [
          "Filtered \xB7 ",
          r.filterNotes.join(" \xB7 ")
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs2(View2, { style: s.row, children: [
        /* @__PURE__ */ jsx2(Kpi, { label: "Total order value", value: compact(t.orderValue), accent: C.primary, foot: `${int(t.orders)} order${t.orders === 1 ? "" : "s"}` }),
        /* @__PURE__ */ jsx2(Kpi, { label: "Provisional profit", value: compact(t.profit), accent: "#8B5CF6", foot: `Margin ${pct(t.orderValue > 0 ? t.profit / t.orderValue * 100 : null, 1)}` }),
        /* @__PURE__ */ jsx2(
          Kpi,
          {
            label: "Actual profit",
            value: compact(t.actualProfit),
            accent: "#059669",
            foot: `${int(t.invoiced)} invoiced \xB7 margin ${pct(t.actualCost + t.actualProfit > 0 ? t.actualProfit / (t.actualCost + t.actualProfit) * 100 : null, 1)}`
          }
        )
      ] }),
      /* @__PURE__ */ jsxs2(View2, { style: [s.row, { marginTop: 8 }], children: [
        /* @__PURE__ */ jsx2(Kpi, { label: "Total enquiries", value: int(t.enquiries), accent: C.info, foot: `${int(t.confirmed)} confirmed \xB7 ${pct(t.conversion)} conversion` }),
        /* @__PURE__ */ jsx2(Kpi, { label: "Lost", value: int(t.lost), accent: C.danger, foot: `${int(t.lostEnquiries)} enquir${t.lostEnquiries === 1 ? "y" : "ies"} \xB7 ${int(t.lostOrders)} order${t.lostOrders === 1 ? "" : "s"} \xB7 ${money(t.lostValue)}` }),
        /* @__PURE__ */ jsx2(View2, { style: { flex: 1 } })
      ] }),
      /* @__PURE__ */ jsx2(Section, { title: "Lost \u2014 reason breakdown", note: `${int(t.lost)} lost in the period`, children: t.lost === 0 ? /* @__PURE__ */ jsx2(View2, { style: [s.card, { backgroundColor: C.primarySoft, borderColor: C.primarySoft }], children: /* @__PURE__ */ jsx2(Text2, { style: { fontSize: 9, color: "#065F46", textAlign: "center" }, children: "Nothing was lost in this period." }) }) : /* @__PURE__ */ jsx2(View2, { style: s.card, wrap: false, children: t.reasons.map((x) => /* @__PURE__ */ jsxs2(View2, { style: { marginBottom: 8 }, children: [
        /* @__PURE__ */ jsxs2(View2, { style: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }, children: [
          /* @__PURE__ */ jsx2(Text2, { style: { fontSize: 9, color: C.ink, fontWeight: 600 }, children: x.reason }),
          /* @__PURE__ */ jsxs2(Text2, { style: { fontSize: 8, color: C.muted }, children: [
            /* @__PURE__ */ jsx2(Text2, { style: { fontWeight: 700, color: C.ink }, children: int(x.count) }),
            " \xB7 ",
            pct(x.count / t.lost * 100),
            " \xB7 ",
            int(x.enquiries),
            " enquir",
            x.enquiries === 1 ? "y" : "ies",
            ", ",
            int(x.orders),
            " order",
            x.orders === 1 ? "" : "s",
            " \xB7 ",
            money(x.value)
          ] })
        ] }),
        /* @__PURE__ */ jsx2(Bar, { value: x.count, max: reasonMax, color: "#F87171" })
      ] }, x.reason)) }) }),
      /* @__PURE__ */ jsxs2(Text2, { style: { fontSize: 7, color: C.faint, marginTop: 14, lineHeight: 1.5 }, children: [
        "Orders are those created in the period; value and profit leave out cancelled orders and orders sent back for revision (",
        int(t.voidedOrders),
        " in the period). Provisional profit is the profit quoted on each order's enquiry. Actual profit is what accounts entered on orders invoiced in the period (by invoice date), so it can include orders created earlier. Enquiries are those dated in the period, at their current stage. Lost counts enquiries marked lost in the period; a lost order is one whose order was cancelled."
      ] }),
      /* @__PURE__ */ jsx2(Footer, { r })
    ] }),
    /* @__PURE__ */ jsxs2(Page, { size: "A4", style: s.page, children: [
      /* @__PURE__ */ jsx2(Section, { title: "Employee performance", note: range, children: /* @__PURE__ */ jsx2(
        Table,
        {
          empty: "No staff for this company",
          rows: r.staff,
          cols: [
            { label: "Staff", width: "19%", strong: true, render: (x) => x.name },
            { label: "Orders", width: "8%", align: "right", render: (x) => int(x.orders) },
            { label: "Order value", width: "14%", align: "right", render: (x) => money(x.value) },
            { label: "Prov. profit", width: "13%", align: "right", render: (x) => money(x.profit) },
            { label: "Actual profit", width: "13%", align: "right", render: (x) => money(x.actualProfit) },
            { label: "Enquiries", width: "9%", align: "right", render: (x) => int(x.enquiries) },
            { label: "Confirmed", width: "9%", align: "right", render: (x) => int(x.confirmed) },
            { label: "Lost", width: "7%", align: "right", render: (x) => int(x.lost) },
            { label: "Target", width: "8%", align: "right", render: (x) => x.target ? pct(x.target.percent) : "\u2014" }
          ]
        }
      ) }),
      /* @__PURE__ */ jsx2(Section, { title: "Target status", note: "Order value against each person's target for the target period", children: /* @__PURE__ */ jsxs2(View2, { style: s.table, children: [
        /* @__PURE__ */ jsx2(View2, { style: s.th, children: [["Staff", "24%"], ["Target period", "23%"], ["Progress", "21%"], ["Achieved / target", "20%"], ["Status", "12%"]].map(([label, width]) => /* @__PURE__ */ jsx2(Text2, { style: [s.thText, { width }], children: label }, label)) }),
        r.staff.filter((x) => x.isSalesman).length === 0 ? /* @__PURE__ */ jsx2(Text2, { style: s.empty, children: "No salesmen" }) : null,
        r.staff.filter((x) => x.isSalesman).map((x) => {
          const tg = x.target;
          const state = tg ? TARGET_STATE[tg.state === "active" && tg.percent >= 100 ? "achieved" : tg.state] : null;
          return /* @__PURE__ */ jsxs2(View2, { style: [s.tr, { alignItems: "center" }], wrap: false, children: [
            /* @__PURE__ */ jsx2(Text2, { style: [s.tdStrong, { width: "24%" }], children: x.name }),
            tg && state ? /* @__PURE__ */ jsxs2(Fragment, { children: [
              /* @__PURE__ */ jsxs2(Text2, { style: [s.td, { width: "23%" }], children: [
                date(tg.start),
                " \u2013 ",
                date(tg.end)
              ] }),
              /* @__PURE__ */ jsxs2(View2, { style: { width: "21%", paddingRight: 10, flexDirection: "row", alignItems: "center", gap: 5 }, children: [
                /* @__PURE__ */ jsx2(View2, { style: { flex: 1 }, children: /* @__PURE__ */ jsx2(Bar, { value: Math.min(tg.percent, 100), max: 100, color: state.color }) }),
                /* @__PURE__ */ jsx2(Text2, { style: [s.td, { width: 30, textAlign: "right" }], children: pct(tg.percent) })
              ] }),
              /* @__PURE__ */ jsxs2(Text2, { style: [s.td, { width: "20%" }], children: [
                money(tg.achieved),
                " / ",
                money(tg.amount)
              ] }),
              /* @__PURE__ */ jsx2(Text2, { style: [s.td, { width: "12%", fontWeight: 700, color: state.color }], children: state.label })
            ] }) : /* @__PURE__ */ jsx2(Text2, { style: [s.td, { width: "76%", color: C.muted }], children: "No target set for this period" })
          ] }, x.id);
        })
      ] }) }),
      /* @__PURE__ */ jsx2(Text2, { style: { fontSize: 7, color: C.faint, marginTop: 10, lineHeight: 1.5 }, children: "Figures are for this company in the report period. Target progress counts all of the salesman's orders across the whole target period, as on the Targets page." }),
      /* @__PURE__ */ jsx2(Footer, { r })
    ] }),
    /* @__PURE__ */ jsxs2(Page, { size: "A4", orientation: "landscape", style: s.page, children: [
      shown.includes("orders") && /* @__PURE__ */ jsxs2(Section, { breakBefore: shown.indexOf("orders") > 0, title: "Orders", note: `${int(t.orders)} counted \xB7 ${money(t.orderValue)} \xB7 prov. profit ${money(t.profit)}`, children: [
        /* @__PURE__ */ jsx2(
          Table,
          {
            empty: "No orders in this period",
            rows: r.details.orders.rows,
            cols: [
              { label: "Order", width: "8%", strong: true, render: (x) => x.job_no ?? `#${x.id}` },
              { label: "Enquiry", width: "9%", render: (x) => ref(x.enquiry_id) },
              { label: "Date", width: "8%", render: (x) => date(x.created_at) },
              { label: "Client", width: "15%", render: (x) => x.client },
              { label: "Staff", width: "11%", render: (x) => x.by },
              { label: "Route", width: "16%", render: (x) => `${title(x.mode)} \xB7 ${x.from} \u203A ${x.to}` },
              { label: "Status", width: "9%", render: (x) => orderStatusLabel(x.status) },
              { label: "Value", width: "8%", align: "right", render: (x) => money(x.amount) },
              { label: "Prov. profit", width: "8%", align: "right", render: (x) => x.profit === null ? "\u2014" : money(x.profit) },
              { label: "Actual profit", width: "8%", align: "right", render: (x) => x.actual_profit === null ? "\u2014" : money(x.actual_profit) }
            ]
          }
        ),
        /* @__PURE__ */ jsx2(Cut, { show: r.details.orders.truncated })
      ] }),
      shown.includes("enquiries") && /* @__PURE__ */ jsxs2(Section, { breakBefore: shown.indexOf("enquiries") > 0, title: "Enquiries", note: `${int(t.enquiries)} raised \xB7 ${int(t.confirmed)} confirmed`, children: [
        /* @__PURE__ */ jsx2(
          Table,
          {
            empty: "No enquiries in this period",
            rows: r.details.enquiries.rows,
            cols: [
              { label: "Enquiry", width: "11%", strong: true, render: (x) => ref(x.id) },
              { label: "Date", width: "9%", render: (x) => date(x.enquiry_date) },
              { label: "Client", width: "18%", render: (x) => x.client },
              { label: "Staff", width: "13%", render: (x) => x.by },
              { label: "Route", width: "20%", render: (x) => `${title(x.mode)} \xB7 ${x.from} \u203A ${x.to}` },
              { label: "Stage", width: "11%", render: (x) => enquiryStatusLabels[x.status] ?? title(x.status) },
              { label: "Quoted", width: "9%", align: "right", render: (x) => x.quoted === null ? "\u2014" : money(x.quoted) },
              { label: "Prov. profit", width: "9%", align: "right", render: (x) => x.profit === null ? "\u2014" : money(x.profit) }
            ]
          }
        ),
        /* @__PURE__ */ jsx2(Cut, { show: r.details.enquiries.truncated })
      ] }),
      shown.includes("confirmed") && /* @__PURE__ */ jsxs2(Section, { breakBefore: shown.indexOf("confirmed") > 0, title: "Confirmed enquiries", note: `${int(t.confirmed)} confirmed of ${int(t.enquiries)} raised`, children: [
        /* @__PURE__ */ jsx2(
          Table,
          {
            empty: "No confirmed enquiries in this period",
            rows: r.details.confirmed.rows,
            cols: [
              { label: "Enquiry", width: "11%", strong: true, render: (x) => ref(x.id) },
              { label: "Date", width: "9%", render: (x) => date(x.enquiry_date) },
              { label: "Client", width: "18%", render: (x) => x.client },
              { label: "Staff", width: "13%", render: (x) => x.by },
              { label: "Route", width: "20%", render: (x) => `${title(x.mode)} \xB7 ${x.from} \u203A ${x.to}` },
              { label: "Stage", width: "11%", render: (x) => enquiryStatusLabels[x.status] ?? title(x.status) },
              { label: "Quoted", width: "9%", align: "right", render: (x) => x.quoted === null ? "\u2014" : money(x.quoted) },
              { label: "Prov. profit", width: "9%", align: "right", render: (x) => x.profit === null ? "\u2014" : money(x.profit) }
            ]
          }
        ),
        /* @__PURE__ */ jsx2(Cut, { show: r.details.confirmed.truncated })
      ] }),
      shown.includes("lost") && /* @__PURE__ */ jsxs2(Section, { breakBefore: shown.indexOf("lost") > 0, title: "Lost enquiries & orders", note: `${int(t.lost)} lost \xB7 ${money(t.lostValue)} quoted value`, children: [
        /* @__PURE__ */ jsx2(
          Table,
          {
            empty: "Nothing was lost in this period",
            rows: r.details.lost.rows,
            cols: [
              { label: "Enquiry", width: "11%", strong: true, render: (x) => ref(x.id) },
              { label: "Type", width: "7%", render: (x) => x.is_order ? "Order" : "Enquiry" },
              { label: "Lost on", width: "9%", render: (x) => date(x.lost_at) },
              { label: "Client", width: "15%", render: (x) => x.client },
              { label: "Staff", width: "12%", render: (x) => x.by },
              { label: "Route", width: "16%", render: (x) => `${x.from} \u203A ${x.to}` },
              { label: "Reason & remark", width: "21%", render: (x) => x.text ?? "\u2014" },
              { label: "Value", width: "9%", align: "right", render: (x) => x.value === null ? "\u2014" : money(x.value) }
            ]
          }
        ),
        /* @__PURE__ */ jsx2(Cut, { show: r.details.lost.truncated })
      ] }),
      /* @__PURE__ */ jsx2(Footer, { r })
    ] })
  ] });
}

// lib/report-pdf.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
async function buildCompanyReportPdf(orgId, from, to, actor, filters) {
  const range = parseRange(from, to);
  if (!range) throw new Error("Invalid date range");
  const report = await getCompanyReport(orgId, range, actor, filters);
  if (!report) return null;
  let logo = null;
  if (report.org.logo_path) {
    const ext = path3.extname(report.org.logo_path).slice(1).toLowerCase();
    logo = await readDocumentFile(report.org.logo_path).then((data) => ({ data, format: ext === "png" ? "png" : "jpg" })).catch(() => null);
  }
  const pdf = await renderToBuffer(/* @__PURE__ */ jsx3(CompanyReportPdf, { report, logo }));
  const fileName = `${report.org.name} report ${from} to ${to}${report.filterNotes.length ? " (filtered)" : ""}.pdf`.replace(/[\\/:*?"<>|]+/g, "-");
  return { pdf, fileName };
}

// lib/email-queue.ts
import { Queue as Queue2 } from "bullmq";

// lib/email-logo.ts
import path4 from "node:path";
var TYPES = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" };
async function emailLogo(org) {
  if (!org.logo_path) return null;
  try {
    const ext = path4.extname(org.logo_path).slice(1).toLowerCase();
    return { filename: `logo.${ext}`, content: await readDocumentFile(org.logo_path), contentType: TYPES[ext] ?? "image/png", cid: "logo" };
  } catch {
    return null;
  }
}

// lib/mailer.ts
import nodemailer from "nodemailer";
var mailConfigured = () => !!process.env.SMTP_HOST;
var transport = null;
async function sendMail(message) {
  if (!mailConfigured()) return false;
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : void 0
  });
  await transport.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, ...message });
  return true;
}

// lib/email-queue.ts
var EMAIL_QUEUE = "emails";
var EMAIL_ATTEMPTS = 3;
async function deliverEmailJob(id) {
  const job = await prisma.emailJob.findUnique({ where: { id } });
  if (!job || job.status === "sent") return;
  await prisma.emailJob.update({ where: { id }, data: { attempts: { increment: 1 } } });
  const logo = await emailLogo({ logo_path: job.logo_path });
  let sent;
  try {
    sent = await sendMail({ to: job.to, subject: job.subject, text: job.text, html: job.html, attachments: logo ? [logo] : void 0 });
  } catch (err) {
    await prisma.emailJob.update({ where: { id }, data: { error: (err instanceof Error ? err.message : String(err)).slice(0, 500) } });
    throw err;
  }
  await prisma.emailJob.update({ where: { id }, data: sent ? { status: "sent", sent_at: /* @__PURE__ */ new Date(), error: null } : { status: "not_configured" } });
}

// worker/index.mts
var worker = new Worker(
  REPORT_QUEUE,
  async (job) => {
    const { reportJobId } = job.data;
    const row = await prisma.reportJob.findUnique({ where: { id: reportJobId }, include: { requestedBy: { select: { id: true, role_id: true } } } });
    if (!row) return;
    await prisma.reportJob.update({ where: { id: row.id }, data: { status: "running" } });
    const params = row.params;
    const built = await buildCompanyReportPdf(params.org, params.from, params.to, { id: row.requestedBy.id, role_id: row.requestedBy.role_id }, parseFilters(params));
    if (!built) throw new Error("Company not found");
    const file_path = `reports/${row.id}.pdf`;
    await writeStoredFile(file_path, built.pdf);
    await prisma.reportJob.update({ where: { id: row.id }, data: { status: "done", file_path, file_name: built.fileName, finished_at: /* @__PURE__ */ new Date(), error: null } });
  },
  // PDF rendering blocks the event loop for seconds, so the lock must outlive it or BullMQ retries a job that is still running.
  { connection: redisConnection(), concurrency: 1, lockDuration: 12e4 }
);
worker.on("failed", async (job, err) => {
  console.error("report job failed", job?.id, err.message);
  if (job && job.attemptsMade >= (job.opts.attempts ?? 1)) {
    await prisma.reportJob.update({ where: { id: job.data.reportJobId }, data: { status: "failed", error: err.message.slice(0, 500), finished_at: /* @__PURE__ */ new Date() } }).catch(() => {
    });
  }
});
worker.on("ready", () => console.log("report worker ready"));
var emailWorker = new Worker(EMAIL_QUEUE, async (job) => deliverEmailJob(job.data.emailJobId), { connection: redisConnection(), concurrency: 1 });
emailWorker.on("failed", async (job, err) => {
  console.error("email job failed", job?.id, err.message);
  if (job && job.attemptsMade >= (job.opts.attempts ?? EMAIL_ATTEMPTS)) {
    await prisma.emailJob.update({ where: { id: job.data.emailJobId }, data: { status: "failed" } }).catch(() => {
    });
  }
});
emailWorker.on("ready", () => console.log("email worker ready"));
process.on("SIGTERM", async () => {
  await Promise.all([worker.close(), emailWorker.close()]);
  process.exit(0);
});
