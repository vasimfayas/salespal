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
import { Prisma as Prisma2 } from "@prisma/client";

// lib/salesman-targets.ts
import { Prisma } from "@prisma/client";
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
  const rows = await prisma.$queryRaw(Prisma.sql`
    SELECT t.id, COALESCE(SUM(o.amount), 0)::float8 AS achieved
    FROM salesman_targets t
    LEFT JOIN orders o
      ON o.created_by_id = t.salesman_id
     AND o.status NOT IN ('cancelled', 'revision_requested')
     AND o.created_at >= t.period_start
     AND o.created_at < t.period_end + 1
    WHERE t.salesman_id IN (${Prisma.join(salesmanIds)})
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

// lib/company-report.ts
var DETAIL_LIMIT = 500;
var n = (v) => Number(v ?? 0);
function parseRange(fromValue, toValue) {
  const from = parseDateOnly(fromValue);
  const to = parseDateOnly(toValue);
  if (!from || !to || from > to) return null;
  return { from, to, end: new Date(to.getTime() + 864e5) };
}
async function getCompanyReport(orgId, range, viewer) {
  const { from, end } = range;
  const day = (d) => Prisma2.sql`${d.toISOString().slice(0, 10)}::date`;
  const [S, E] = [day(from), day(end)];
  const voided = Prisma2.join([...VOID_ORDER_STATUSES]);
  const [org, orderAgg, actualAgg, enquiryAgg, lostAgg, orders, enquiries, lostItems, sellers] = await Promise.all([
    prisma.organization.findUnique({ where: { id: orgId }, select: { name: true, prefix: true, logo_path: true, address: true, phone: true, email: true } }),
    prisma.$queryRaw(Prisma2.sql`
      SELECT o.created_by_id AS by,
             COUNT(*) FILTER (WHERE o.status NOT IN (${voided}))::int AS count,
             COALESCE(SUM(o.amount) FILTER (WHERE o.status NOT IN (${voided})), 0)::float8 AS value,
             COALESCE(SUM(e.provisional_profit) FILTER (WHERE o.status NOT IN (${voided})), 0)::float8 AS profit,
             COUNT(*) FILTER (WHERE o.status IN (${voided}))::int AS voided
      FROM orders o LEFT JOIN enquiries e ON e.id = o.enquiry_id
      WHERE o.org_id = ${orgId} AND o.created_at >= ${S} AND o.created_at < ${E}
      GROUP BY 1`),
    prisma.$queryRaw(Prisma2.sql`
      SELECT o.created_by_id AS by, COUNT(*)::int AS count,
             COALESCE(SUM(e.actual_cost), 0)::float8 AS cost, COALESCE(SUM(e.actual_profit), 0)::float8 AS profit
      FROM orders o JOIN enquiries e ON e.id = o.enquiry_id
      WHERE o.org_id = ${orgId} AND o.status NOT IN (${voided}) AND e.actual_profit IS NOT NULL
        AND o.invoice_date >= ${S} AND o.invoice_date < ${E}
      GROUP BY 1`),
    prisma.$queryRaw(Prisma2.sql`
      SELECT e.created_by_id AS by, COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE e.status = 'confirmed')::int AS confirmed,
             COUNT(*) FILTER (WHERE e.status = 'lost')::int AS lost,
             COALESCE(SUM(e.provisional_cost + e.provisional_profit), 0)::float8 AS quoted
      FROM enquiries e
      WHERE e.org_id = ${orgId} AND e.enquiry_date >= ${S} AND e.enquiry_date < ${E}
      GROUP BY 1`),
    // A lost enquiry whose order was cancelled counts as a lost order.
    prisma.$queryRaw(Prisma2.sql`
      SELECT e.created_by_id AS by, COALESCE(e.lost_reason, '') AS reason,
             EXISTS (SELECT 1 FROM orders o WHERE o.origin_enquiry_id = e.id AND o.status = 'cancelled') AS is_order,
             COUNT(*)::int AS count, COALESCE(SUM(e.provisional_cost + e.provisional_profit), 0)::float8 AS value
      FROM enquiries e
      WHERE e.org_id = ${orgId} AND e.status = 'lost' AND e.cancelled_at >= ${S} AND e.cancelled_at < ${E}
      GROUP BY 1, 2, 3`),
    prisma.$queryRaw(Prisma2.sql`
      SELECT o.id, o.job_no, COALESCE(o.enquiry_id, o.origin_enquiry_id) AS enquiry_id, o.created_at, c.name AS client, u.name AS by,
             o.mode, o."from", o."to", o.status, o.amount::float8 AS amount, e.provisional_profit::float8 AS profit,
             e.actual_profit::float8 AS actual_profit
      FROM orders o
      JOIN clients c ON c.id = o.client_id
      JOIN users u ON u.id = o.created_by_id
      LEFT JOIN enquiries e ON e.id = o.enquiry_id
      WHERE o.org_id = ${orgId} AND o.created_at >= ${S} AND o.created_at < ${E}
      ORDER BY o.created_at, o.id LIMIT ${DETAIL_LIMIT + 1}`),
    prisma.$queryRaw(Prisma2.sql`
      SELECT e.id, e.enquiry_date, c.name AS client, u.name AS by, e.mode, e."from", e."to", e.status,
             (e.provisional_cost + e.provisional_profit)::float8 AS quoted, e.provisional_profit::float8 AS profit
      FROM enquiries e
      JOIN clients c ON c.id = e.client_id
      JOIN users u ON u.id = e.created_by_id
      WHERE e.org_id = ${orgId} AND e.enquiry_date >= ${S} AND e.enquiry_date < ${E}
      ORDER BY e.enquiry_date, e.id LIMIT ${DETAIL_LIMIT + 1}`),
    prisma.$queryRaw(Prisma2.sql`
      SELECT e.id, c.name AS client, u.name AS by, e."from", e."to", e.lost_reason AS reason, e.cancel_reason AS text,
             EXISTS (SELECT 1 FROM orders o WHERE o.origin_enquiry_id = e.id AND o.status = 'cancelled') AS is_order,
             e.cancelled_at AS lost_at, (e.provisional_cost + e.provisional_profit)::float8 AS value
      FROM enquiries e
      JOIN clients c ON c.id = e.client_id
      JOIN users u ON u.id = e.created_by_id
      WHERE e.org_id = ${orgId} AND e.status = 'lost' AND e.cancelled_at >= ${S} AND e.cancelled_at < ${E}
      ORDER BY e.cancelled_at, e.id LIMIT ${DETAIL_LIMIT + 1}`),
    prisma.managerSalesman.findMany({ where: { org_id: orgId }, select: { salesman_id: true }, distinct: ["salesman_id"] })
  ]);
  if (!org) return null;
  let staffIds = [.../* @__PURE__ */ new Set([...sellers.map((x) => x.salesman_id), ...orderAgg.map((r) => r.by), ...actualAgg.map((r) => r.by), ...enquiryAgg.map((r) => r.by), ...lostAgg.map((r) => r.by)])];
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
  const sum = (rows, f) => rows.reduce((a, r) => a + n(f(r)), 0);
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
    staff,
    details: {
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
  return /* @__PURE__ */ jsxs2(Document, { title: `${r.org.name} \u2014 report ${range}`, author: "SalesPal", subject: "Company performance report", children: [
    /* @__PURE__ */ jsxs2(Page, { size: "A4", style: s.page, children: [
      /* @__PURE__ */ jsxs2(View2, { style: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }, children: [
        logo ? /* @__PURE__ */ jsx2(Image, { src: logo, style: { maxHeight: 56, maxWidth: 200, objectFit: "contain" } }) : /* @__PURE__ */ jsx2(Text2, { style: { fontSize: 16, fontWeight: 800, color: C.ink }, children: r.org.name }),
        /* @__PURE__ */ jsx2(View2, { style: { alignItems: "flex-end", maxWidth: 240 }, children: [r.org.address, r.org.phone, r.org.email].filter(Boolean).map((line) => /* @__PURE__ */ jsx2(Text2, { style: { fontSize: 7.5, color: C.muted, textAlign: "right" }, children: line }, line)) })
      ] }),
      /* @__PURE__ */ jsx2(View2, { style: s.hero, children: /* @__PURE__ */ jsxs2(View2, { children: [
        /* @__PURE__ */ jsx2(Text2, { style: s.eyebrow, children: "Company report \xB7 Overall summary" }),
        /* @__PURE__ */ jsx2(Text2, { style: s.heroTitle, children: r.org.name }),
        /* @__PURE__ */ jsx2(Text2, { style: s.heroSub, children: range })
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
      /* @__PURE__ */ jsxs2(Section, { title: "Orders", note: `${int(t.orders)} counted \xB7 ${money(t.orderValue)} \xB7 prov. profit ${money(t.profit)}`, children: [
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
      /* @__PURE__ */ jsxs2(Section, { title: "Enquiries", note: `${int(t.enquiries)} raised \xB7 ${int(t.confirmed)} confirmed`, breakBefore: true, children: [
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
      /* @__PURE__ */ jsxs2(Section, { title: "Lost enquiries & orders", note: `${int(t.lost)} lost \xB7 ${money(t.lostValue)} quoted value`, breakBefore: true, children: [
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
async function buildCompanyReportPdf(orgId, from, to, actor) {
  const range = parseRange(from, to);
  if (!range) throw new Error("Invalid date range");
  const report = await getCompanyReport(orgId, range, actor);
  if (!report) return null;
  let logo = null;
  if (report.org.logo_path) {
    const ext = path3.extname(report.org.logo_path).slice(1).toLowerCase();
    logo = await readDocumentFile(report.org.logo_path).then((data) => ({ data, format: ext === "png" ? "png" : "jpg" })).catch(() => null);
  }
  const pdf = await renderToBuffer(/* @__PURE__ */ jsx3(CompanyReportPdf, { report, logo }));
  const fileName = `${report.org.name} report ${from} to ${to}.pdf`.replace(/[\\/:*?"<>|]+/g, "-");
  return { pdf, fileName };
}

// worker/index.mts
var worker = new Worker(
  REPORT_QUEUE,
  async (job) => {
    const { reportJobId } = job.data;
    const row = await prisma.reportJob.findUnique({ where: { id: reportJobId }, include: { requestedBy: { select: { id: true, role_id: true } } } });
    if (!row) return;
    await prisma.reportJob.update({ where: { id: row.id }, data: { status: "running" } });
    const { org, from, to } = row.params;
    const built = await buildCompanyReportPdf(org, from, to, { id: row.requestedBy.id, role_id: row.requestedBy.role_id });
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
process.on("SIGTERM", async () => {
  await worker.close();
  process.exit(0);
});
