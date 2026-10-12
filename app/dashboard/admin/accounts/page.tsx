import { AlertTriangle, Building2, Coins, LineChart, PiggyBank, ReceiptText, Wallet } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { getPeriodRange } from "@/components/dashboard/AdminDashboardSections";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { MonthlyTrendChartWrapper } from "@/components/dashboard/MonthlyTrendChartWrapper";
import { KpiTile } from "@/components/shared/KpiTile";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCachedAdminOrgs } from "@/lib/cached-queries";
import { getOwnerAccounts, getProfitTrend } from "@/lib/owner-accounts";
import { cn, formatAmount } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PERIOD_LABEL = { this_month: "this month", last_month: "last month", quarter: "this quarter" } as const;
type PeriodKey = keyof typeof PERIOD_LABEL;

/** Owner's accounts: orders raised and cost / actual profit invoiced in the period, receivables as of today, per company. */
export default async function OwnerAccountsPage({ searchParams }: { searchParams: Promise<{ period?: string; org?: string }> }) {
  const params = await searchParams;
  const period: PeriodKey = params.period && params.period in PERIOD_LABEL ? (params.period as PeriodKey) : "this_month";
  const orgId = params.org ? Number(params.org) : undefined;
  const [orgs, all, trend] = await Promise.all([getCachedAdminOrgs(), getOwnerAccounts(getPeriodRange(period)), getProfitTrend(orgId)]);
  const rows = orgId ? all.filter((r) => r.id === orgId) : all;

  const sum = (k: "orders" | "value" | "notInvoiced" | "invoiced" | "cost" | "profit" | "receivable" | "receivableCount" | "pastDue") =>
    rows.reduce((t, r) => t + r[k], 0);
  const t = {
    orders: sum("orders"),
    value: sum("value"),
    notInvoiced: sum("notInvoiced"),
    invoiced: sum("invoiced"),
    cost: sum("cost"),
    profit: sum("profit"),
    receivable: sum("receivable"),
    receivableCount: sum("receivableCount"),
    pastDue: sum("pastDue"),
  };
  const when = PERIOD_LABEL[period];

  return (
    <div className="space-y-6">
      <PageHeader title="Accounts" subtitle={`Orders raised and profit invoiced ${when}, by company. Receivables as of today.`} action={<DashboardFilters orgs={orgs} />} />

      {rows.length === 0 ? (
        <EmptyState icon={Building2} title="No companies yet" message="Add a company to see its accounts here." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiTile
              icon={ReceiptText}
              label="Orders"
              value={formatAmount(t.value)}
              meta={`${t.orders.toLocaleString()} orders`}
              definition={`Value of orders raised ${when}, not counting cancelled or sent-back orders.${t.notInvoiced ? ` ${t.notInvoiced.toLocaleString()} of them aren't invoiced yet.` : ""}`}
            />
            <KpiTile
              icon={Coins}
              tone="warning"
              label="Cost"
              value={formatAmount(t.cost)}
              meta={`${t.invoiced.toLocaleString()} invoiced`}
              definition={`Actual cost of orders invoiced ${when} (by invoice date): what agents and carriers charged.`}
            />
            <KpiTile
              icon={PiggyBank}
              tone={t.profit < 0 ? "danger" : "success"}
              label="Actual profit"
              value={formatAmount(t.profit)}
              meta={t.cost + t.profit > 0 ?`${((t.profit / (t.cost + t.profit)) * 100).toFixed(1)}% margin` : undefined}
              definition={`Actual profit accounts entered on orders invoiced ${when} (by invoice date), not counting cancelled or sent-back orders.`}
            />
            <KpiTile
              icon={Wallet}
              tone="info"
              label="Receivables"
              value={formatAmount(t.receivable)}
              meta={t.pastDue > 0 ? `${formatAmount(t.pastDue)} past due` : `${t.receivableCount} orders`}
              definition="Unpaid balance clients owe today on all active and completed orders."
            />
          </div>

          <SectionCard
            title="Profit trend"
            subtitle={`Last 12 months${orgId ? ` · ${rows[0]?.name}` : " · all companies"}. Provisional by month raised, actual by month invoiced.`}
            icon={LineChart}
            iconClassName="text-primary"
          >
            <MonthlyTrendChartWrapper
              money
              data={trend}
              series={[
                { key: "provisional", label: "Provisional profit" },
                { key: "actual", label: "Actual profit" },
              ]}
            />
          </SectionCard>

          <SectionCard title="By company" subtitle={`Orders by date raised; cost and profit by invoice date (${when}). Receivables as of today.`} icon={Building2} iconClassName="text-primary" bodyClassName="-mx-6 -mb-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[840px] text-left text-sm">
                <thead className="border-y border-border bg-subtle text-xs font-medium text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-6 py-2.5">Company</th>
                    <th scope="col" className="px-3 py-2.5 text-right">Orders</th>
                    <th scope="col" className="px-3 py-2.5 text-right">Order value</th>
                    <th scope="col" className="px-3 py-2.5 text-right">Invoiced</th>
                    <th scope="col" className="px-3 py-2.5 text-right">Cost</th>
                    <th scope="col" className="px-3 py-2.5 text-right">Actual profit</th>
                    <th scope="col" className="px-3 py-2.5 text-right">Receivables</th>
                    <th scope="col" className="px-6 py-2.5 text-right">Past due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border tabular-nums">
                  {rows.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/40">
                      <th scope="row" className="px-6 py-3 font-semibold text-foreground">{r.name}</th>
                      <td className="px-3 py-3 text-right text-foreground">{r.orders.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right text-foreground">
                        {formatAmount(r.value)}
                        {r.notInvoiced > 0 && <span className="block text-xs text-muted-foreground">{r.notInvoiced} not invoiced</span>}
                      </td>
                      <td className="px-3 py-3 text-right text-foreground">{r.invoiced.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right text-foreground">{formatAmount(r.cost)}</td>
                      <td className="px-3 py-3 text-right">
                        <span className={cn("font-medium", r.profit < 0 ? "text-danger-foreground" : "text-success-foreground")}>{formatAmount(r.profit)}</span>
                      </td>
                      <td className="px-3 py-3 text-right text-foreground">{formatAmount(r.receivable)}</td>
                      <td className="px-6 py-3 text-right">
                        {r.pastDue > 0 ? (
                          <span className="inline-flex items-center gap-1 font-medium text-danger-foreground">
                            <AlertTriangle size={12} aria-hidden /> {formatAmount(r.pastDue)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {rows.length > 1 && (
                  <tfoot className="border-t-2 border-border bg-subtle font-semibold tabular-nums text-foreground">
                    <tr>
                      <th scope="row" className="px-6 py-3">Total</th>
                      <td className="px-3 py-3 text-right">{t.orders.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right">{formatAmount(t.value)}</td>
                      <td className="px-3 py-3 text-right">{t.invoiced.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right">{formatAmount(t.cost)}</td>
                      <td className="px-3 py-3 text-right">{formatAmount(t.profit)}</td>
                      <td className="px-3 py-3 text-right">{formatAmount(t.receivable)}</td>
                      <td className="px-6 py-3 text-right">{formatAmount(t.pastDue)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
}
