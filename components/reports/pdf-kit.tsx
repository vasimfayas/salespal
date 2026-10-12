import path from "node:path";
import { Font, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { EnquiryStatus } from "@/types/enquiry";

/* Server-only building blocks shared by the PDF reports (rendered with @react-pdf/renderer in API routes). */

const fontDir = path.join(process.cwd(), "node_modules/@fontsource/inter/files");
Font.register({
  family: "Inter",
  fonts: [400, 500, 600, 700, 800].map((fontWeight) => ({ src: path.join(fontDir, `inter-latin-${fontWeight}-normal.woff`), fontWeight })),
});
Font.registerHyphenationCallback((word) => [word]);

export const C = {
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
  info: "#2563EB",
};

export const STATUS_COLOR: Record<EnquiryStatus, string> = {
  sent_to_client: "#0EA5E9",
  inquiry_received: "#94A3B8",
  with_agent: "#F97316",
  quoted: "#3B82F6",
  revision_requested: "#F59E0B",
  confirmed: "#059669",
  lost: "#EF4444",
};

export const s = StyleSheet.create({
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
  footer: { position: "absolute", bottom: 20, left: 36, right: 36, flexDirection: "row", justifyContent: "space-between", fontSize: 7, color: C.faint, borderTopWidth: 1, borderTopColor: C.line, paddingTop: 6 },
});

/* ───────────── formatting ───────────── */

export const money = (v: number) => new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
export const compact = (v: number) =>
  Math.abs(v) >= 100_000 ? new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(v) : money(v);
export const int = (v: number) => new Intl.NumberFormat("en").format(v);
export const pct = (v: number | null, digits = 0) => (v === null ? "—" : `${v.toFixed(digits)}%`);
export const date = (d: Date) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
export const title = (v: string) => v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function delta(current: number, previous: number) {
  if (previous === 0) return current === 0 ? { text: "No change", color: C.muted } : { text: "New this month", color: C.primary };
  const change = ((current - previous) / previous) * 100;
  if (Math.abs(change) < 0.5) return { text: "No change", color: C.muted };
  return { text: `${change > 0 ? "↑" : "↓"} ${Math.abs(change).toFixed(0)}%`, color: change > 0 ? C.primary : C.danger };
}

/* ───────────── building blocks ───────────── */

export function Section({ title: heading, note, children, breakBefore }: { title: string; note?: string; children: React.ReactNode; breakBefore?: boolean }) {
  return (
    <View style={s.section} break={breakBefore}>
      <View style={s.sectionHead} minPresenceAhead={60}>
        <View style={s.sectionBar} />
        <Text style={s.sectionTitle}>{heading}</Text>
        {note ? <Text style={s.sectionNote}>{note}</Text> : null}
      </View>
      {children}
    </View>
  );
}

export function Kpi({ label, value, foot, accent, children }: { label: string; value: string; foot?: string; accent?: string; children?: React.ReactNode }) {
  return (
    <View style={[s.kpi, accent ? { borderTopWidth: 3, borderTopColor: accent } : {}]}>
      <Text style={s.kpiLabel}>{label}</Text>
      <Text style={s.kpiValue}>{value}</Text>
      {foot ? <Text style={s.kpiFoot}>{foot}</Text> : null}
      {children}
    </View>
  );
}

export function Trend({ current, previous, label, invert }: { current: number; previous: number; label: string; invert?: boolean }) {
  const d = delta(current, previous);
  const color = invert && d.color !== C.muted ? (d.color === C.primary ? C.danger : C.primary) : d.color;
  return (
    <Text style={s.kpiFoot}>
      <Text style={{ color, fontWeight: 700 }}>{d.text}</Text> vs {label}
    </Text>
  );
}

export function Bar({ value, max, color, height = 6 }: { value: number; max: number; color: string; height?: number }) {
  const width = max > 0 ? Math.max((value / max) * 100, value > 0 ? 2 : 0) : 0;
  return (
    <View style={[s.track, { height, borderRadius: height / 2 }]}>
      <View style={{ width: `${width}%`, height, borderRadius: height / 2, backgroundColor: color }} />
    </View>
  );
}

export type Col<T> = { label: string; width: number | string; align?: "right"; render: (row: T) => React.ReactNode; strong?: boolean };

export function Table<T>({ cols, rows, empty }: { cols: Col<T>[]; rows: T[]; empty: string }) {
  return (
    <View style={s.table}>
      <View style={s.th} fixed>
        {cols.map((c) => (
          <Text key={c.label} style={[s.thText, { width: c.width }, c.align === "right" ? s.num : {}]}>
            {c.label}
          </Text>
        ))}
      </View>
      {rows.length === 0 ? (
        <Text style={s.empty}>{empty}</Text>
      ) : (
        rows.map((row, i) => (
          <View key={i} style={[s.tr, i === rows.length - 1 ? { borderBottomWidth: 0 } : {}]} wrap={false}>
            {cols.map((c) => (
              <View key={c.label} style={{ width: c.width, paddingRight: c.align === "right" ? 0 : 6 }}>
                <Text style={[c.strong ? s.tdStrong : s.td, c.align === "right" ? s.num : {}]}>{c.render(row)}</Text>
              </View>
            ))}
          </View>
        ))
      )}
    </View>
  );
}
