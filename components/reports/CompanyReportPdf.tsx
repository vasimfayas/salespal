import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import type { CompanyReport } from "@/lib/company-report";
import { enquiryRef, enquiryStatusLabels, type EnquiryStatus } from "@/types/enquiry";
import { orderStatusLabel } from "@/types/order";
import type { TargetState } from "@/types/salesman-target";
import { Bar, C, compact, date, int, Kpi, money, pct, s, Section, Table, title } from "@/components/reports/pdf-kit";

/* Server-only: rendered to a PDF buffer by app/api/reports/company/route.tsx. */

export type PdfLogo = { data: Buffer; format: "png" | "jpg" } | null;

const TARGET_STATE: Record<TargetState, { label: string; color: string }> = {
  active: { label: "In progress", color: C.info },
  upcoming: { label: "Upcoming", color: C.muted },
  achieved: { label: "Achieved", color: C.primary },
  missed: { label: "Missed", color: C.danger },
  replaced: { label: "Replaced", color: C.muted },
};

function Footer({ r }: { r: CompanyReport }) {
  return (
    <View style={s.footer} fixed>
      <Text>
        {r.org.name} · {date(r.from)} – {date(r.to)} · Generated {date(r.generatedAt)}
      </Text>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );
}

const Cut = ({ show }: { show: boolean }) =>
  show ? <Text style={{ fontSize: 7.5, color: C.warning, marginTop: 4 }}>Showing the first 500 rows. Pick a shorter date range to see them all.</Text> : null;

export function CompanyReportPdf({ report: r, logo }: { report: CompanyReport; logo: PdfLogo }) {
  const t = r.summary;
  const reasonMax = Math.max(...t.reasons.map((x) => x.count), 1);
  const ref = (id: number | null) => (id ? enquiryRef(id, r.org.prefix) : "—");
  const range = `${date(r.from)} – ${date(r.to)}`;
  const shown = r.filters.parts;

  return (
    <Document title={`${r.org.name} — report ${range}`} author="SalesPal" subject="Company performance report">
      {/* 1 · Overall summary */}
      <Page size="A4" style={s.page}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
          {logo ? <Image src={logo} style={{ maxHeight: 56, maxWidth: 200, objectFit: "contain" }} /> : <Text style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{r.org.name}</Text>}
          <View style={{ alignItems: "flex-end", maxWidth: 240 }}>
            {[r.org.address, r.org.phone, r.org.email].filter(Boolean).map((line) => (
              <Text key={line} style={{ fontSize: 7.5, color: C.muted, textAlign: "right" }}>
                {line}
              </Text>
            ))}
          </View>
        </View>

        <View style={s.hero}>
          <View>
            <Text style={s.eyebrow}>Company report · Overall summary</Text>
            <Text style={s.heroTitle}>{r.org.name}</Text>
            <Text style={s.heroSub}>{range}</Text>
            {r.filterNotes.length > 0 && <Text style={[s.heroSub, { marginTop: 3 }]}>Filtered · {r.filterNotes.join(" · ")}</Text>}
          </View>
        </View>

        <View style={s.row}>
          <Kpi label="Total order value" value={compact(t.orderValue)} accent={C.primary} foot={`${int(t.orders)} order${t.orders === 1 ? "" : "s"}`} />
          <Kpi label="Provisional profit" value={compact(t.profit)} accent="#8B5CF6" foot={`Margin ${pct(t.orderValue > 0 ? (t.profit / t.orderValue) * 100 : null, 1)}`} />
          <Kpi
            label="Actual profit"
            value={compact(t.actualProfit)}
            accent="#059669"
            foot={`${int(t.invoiced)} invoiced · margin ${pct(t.actualCost + t.actualProfit > 0 ? (t.actualProfit / (t.actualCost + t.actualProfit)) * 100 : null, 1)}`}
          />
        </View>
        <View style={[s.row, { marginTop: 8 }]}>
          <Kpi label="Total enquiries" value={int(t.enquiries)} accent={C.info} foot={`${int(t.confirmed)} confirmed · ${pct(t.conversion)} conversion`} />
          <Kpi label="Lost" value={int(t.lost)} accent={C.danger} foot={`${int(t.lostEnquiries)} enquir${t.lostEnquiries === 1 ? "y" : "ies"} · ${int(t.lostOrders)} order${t.lostOrders === 1 ? "" : "s"} · ${money(t.lostValue)}`} />
          <View style={{ flex: 1 }} />
        </View>

        <Section title="Lost — reason breakdown" note={`${int(t.lost)} lost in the period`}>
          {t.lost === 0 ? (
            <View style={[s.card, { backgroundColor: C.primarySoft, borderColor: C.primarySoft }]}>
              <Text style={{ fontSize: 9, color: "#065F46", textAlign: "center" }}>Nothing was lost in this period.</Text>
            </View>
          ) : (
            <View style={s.card} wrap={false}>
              {t.reasons.map((x) => (
                <View key={x.reason} style={{ marginBottom: 8 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
                    <Text style={{ fontSize: 9, color: C.ink, fontWeight: 600 }}>{x.reason}</Text>
                    <Text style={{ fontSize: 8, color: C.muted }}>
                      <Text style={{ fontWeight: 700, color: C.ink }}>{int(x.count)}</Text> · {pct((x.count / t.lost) * 100)} · {int(x.enquiries)} enquir
                      {x.enquiries === 1 ? "y" : "ies"}, {int(x.orders)} order{x.orders === 1 ? "" : "s"} · {money(x.value)}
                    </Text>
                  </View>
                  <Bar value={x.count} max={reasonMax} color="#F87171" />
                </View>
              ))}
            </View>
          )}
        </Section>

        <Text style={{ fontSize: 7, color: C.faint, marginTop: 14, lineHeight: 1.5 }}>
          Orders are those created in the period; value and profit leave out cancelled orders and orders sent back for revision ({int(t.voidedOrders)} in the
          period). Provisional profit is the profit quoted on each order&apos;s enquiry. Actual profit is what accounts entered on orders invoiced in the period
          (by invoice date), so it can include orders created earlier. Enquiries are those dated in the period, at their current stage. Lost counts
          enquiries marked lost in the period; a lost order is one whose order was cancelled.
        </Text>
        <Footer r={r} />
      </Page>

      {/* 2 · Employee performance */}
      <Page size="A4" style={s.page}>
        <Section title="Employee performance" note={range}>
          <Table
            empty="No staff for this company"
            rows={r.staff}
            cols={[
              { label: "Staff", width: "19%", strong: true, render: (x) => x.name },
              { label: "Orders", width: "8%", align: "right", render: (x) => int(x.orders) },
              { label: "Order value", width: "14%", align: "right", render: (x) => money(x.value) },
              { label: "Prov. profit", width: "13%", align: "right", render: (x) => money(x.profit) },
              { label: "Actual profit", width: "13%", align: "right", render: (x) => money(x.actualProfit) },
              { label: "Enquiries", width: "9%", align: "right", render: (x) => int(x.enquiries) },
              { label: "Confirmed", width: "9%", align: "right", render: (x) => int(x.confirmed) },
              { label: "Lost", width: "7%", align: "right", render: (x) => int(x.lost) },
              { label: "Target", width: "8%", align: "right", render: (x) => (x.target ? pct(x.target.percent) : "—") },
            ]}
          />
        </Section>

        <Section title="Target status" note="Order value against each person's target for the target period">
          <View style={s.table}>
            <View style={s.th}>
              {[["Staff", "24%"], ["Target period", "23%"], ["Progress", "21%"], ["Achieved / target", "20%"], ["Status", "12%"]].map(([label, width]) => (
                <Text key={label} style={[s.thText, { width }]}>
                  {label}
                </Text>
              ))}
            </View>
            {r.staff.filter((x) => x.isSalesman).length === 0 ? <Text style={s.empty}>No salesmen</Text> : null}
            {r.staff
              .filter((x) => x.isSalesman)
              .map((x) => {
                const tg = x.target;
                // A running target already past 100% reads as achieved, not "in progress".
                const state = tg ? TARGET_STATE[tg.state === "active" && tg.percent >= 100 ? "achieved" : tg.state] : null;
                return (
                  <View key={x.id} style={[s.tr, { alignItems: "center" }]} wrap={false}>
                    <Text style={[s.tdStrong, { width: "24%" }]}>{x.name}</Text>
                    {tg && state ? (
                      <>
                        <Text style={[s.td, { width: "23%" }]}>
                          {date(tg.start)} – {date(tg.end)}
                        </Text>
                        <View style={{ width: "21%", paddingRight: 10, flexDirection: "row", alignItems: "center", gap: 5 }}>
                          <View style={{ flex: 1 }}>
                            <Bar value={Math.min(tg.percent, 100)} max={100} color={state.color} />
                          </View>
                          <Text style={[s.td, { width: 30, textAlign: "right" }]}>{pct(tg.percent)}</Text>
                        </View>
                        <Text style={[s.td, { width: "20%" }]}>
                          {money(tg.achieved)} / {money(tg.amount)}
                        </Text>
                        <Text style={[s.td, { width: "12%", fontWeight: 700, color: state.color }]}>{state.label}</Text>
                      </>
                    ) : (
                      <Text style={[s.td, { width: "76%", color: C.muted }]}>No target set for this period</Text>
                    )}
                  </View>
                );
              })}
          </View>
        </Section>
        <Text style={{ fontSize: 7, color: C.faint, marginTop: 10, lineHeight: 1.5 }}>
          Figures are for this company in the report period. Target progress counts all of the salesman&apos;s orders across the whole target period, as on the
          Targets page.
        </Text>
        <Footer r={r} />
      </Page>

      {/* 3+ · Details */}
      <Page size="A4" orientation="landscape" style={s.page}>
        {shown.includes("orders") && (
        <Section breakBefore={shown.indexOf("orders") > 0} title="Orders" note={`${int(t.orders)} counted · ${money(t.orderValue)} · prov. profit ${money(t.profit)}`}>
          <Table
            empty="No orders in this period"
            rows={r.details.orders.rows}
            cols={[
              { label: "Order", width: "8%", strong: true, render: (x) => x.job_no ?? `#${x.id}` },
              { label: "Enquiry", width: "9%", render: (x) => ref(x.enquiry_id) },
              { label: "Date", width: "8%", render: (x) => date(x.created_at) },
              { label: "Client", width: "15%", render: (x) => x.client },
              { label: "Staff", width: "11%", render: (x) => x.by },
              { label: "Route", width: "16%", render: (x) => `${title(x.mode)} · ${x.from} › ${x.to}` },
              { label: "Status", width: "9%", render: (x) => orderStatusLabel(x.status) },
              { label: "Value", width: "8%", align: "right", render: (x) => money(x.amount) },
              { label: "Prov. profit", width: "8%", align: "right", render: (x) => (x.profit === null ? "—" : money(x.profit)) },
              { label: "Actual profit", width: "8%", align: "right", render: (x) => (x.actual_profit === null ? "—" : money(x.actual_profit)) },
            ]}
          />
          <Cut show={r.details.orders.truncated} />
        </Section>
        )}
        {shown.includes("enquiries") && (
        <Section breakBefore={shown.indexOf("enquiries") > 0} title="Enquiries" note={`${int(t.enquiries)} raised · ${int(t.confirmed)} confirmed`}>
          <Table
            empty="No enquiries in this period"
            rows={r.details.enquiries.rows}
            cols={[
              { label: "Enquiry", width: "11%", strong: true, render: (x) => ref(x.id) },
              { label: "Date", width: "9%", render: (x) => date(x.enquiry_date) },
              { label: "Client", width: "18%", render: (x) => x.client },
              { label: "Staff", width: "13%", render: (x) => x.by },
              { label: "Route", width: "20%", render: (x) => `${title(x.mode)} · ${x.from} › ${x.to}` },
              { label: "Stage", width: "11%", render: (x) => enquiryStatusLabels[x.status as EnquiryStatus] ?? title(x.status) },
              { label: "Quoted", width: "9%", align: "right", render: (x) => (x.quoted === null ? "—" : money(x.quoted)) },
              { label: "Prov. profit", width: "9%", align: "right", render: (x) => (x.profit === null ? "—" : money(x.profit)) },
            ]}
          />
          <Cut show={r.details.enquiries.truncated} />
        </Section>
        )}
        {shown.includes("confirmed") && (
        <Section breakBefore={shown.indexOf("confirmed") > 0} title="Confirmed enquiries" note={`${int(t.confirmed)} confirmed of ${int(t.enquiries)} raised`}>
          <Table
            empty="No confirmed enquiries in this period"
            rows={r.details.confirmed.rows}
            cols={[
              { label: "Enquiry", width: "11%", strong: true, render: (x) => ref(x.id) },
              { label: "Date", width: "9%", render: (x) => date(x.enquiry_date) },
              { label: "Client", width: "18%", render: (x) => x.client },
              { label: "Staff", width: "13%", render: (x) => x.by },
              { label: "Route", width: "20%", render: (x) => `${title(x.mode)} · ${x.from} › ${x.to}` },
              { label: "Stage", width: "11%", render: (x) => enquiryStatusLabels[x.status as EnquiryStatus] ?? title(x.status) },
              { label: "Quoted", width: "9%", align: "right", render: (x) => (x.quoted === null ? "—" : money(x.quoted)) },
              { label: "Prov. profit", width: "9%", align: "right", render: (x) => (x.profit === null ? "—" : money(x.profit)) },
            ]}
          />
          <Cut show={r.details.confirmed.truncated} />
        </Section>
        )}
        {shown.includes("lost") && (
        <Section breakBefore={shown.indexOf("lost") > 0} title="Lost enquiries & orders" note={`${int(t.lost)} lost · ${money(t.lostValue)} quoted value`}>
          <Table
            empty="Nothing was lost in this period"
            rows={r.details.lost.rows}
            cols={[
              { label: "Enquiry", width: "11%", strong: true, render: (x) => ref(x.id) },
              { label: "Type", width: "7%", render: (x) => (x.is_order ? "Order" : "Enquiry") },
              { label: "Lost on", width: "9%", render: (x) => date(x.lost_at) },
              { label: "Client", width: "15%", render: (x) => x.client },
              { label: "Staff", width: "12%", render: (x) => x.by },
              { label: "Route", width: "16%", render: (x) => `${x.from} › ${x.to}` },
              { label: "Reason & remark", width: "21%", render: (x) => x.text ?? "—" },
              { label: "Value", width: "9%", align: "right", render: (x) => (x.value === null ? "—" : money(x.value)) },
            ]}
          />
          <Cut show={r.details.lost.truncated} />
        </Section>
        )}
        <Footer r={r} />
      </Page>
    </Document>
  );
}
