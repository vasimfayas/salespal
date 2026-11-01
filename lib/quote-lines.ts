/**
 * Itemised quote: one line per charge (e.g. "Transport", cost 500, selling 550). Each agent's set of lines is
 * saved as an EnquiryQuoteOption; the chosen one becomes the enquiry's quote.
 * The enquiry still stores the totals: provisional_cost = Σ cost, provisional_profit = Σ selling − Σ cost,
 * so orders, approvals and reports keep using those. Client-safe (no server imports).
 */

export type QuoteLine = { label: string; cost: number; selling: number };
/** As typed in the form. */
export type QuoteLineInput = { label: string; cost: string; selling: string };

export const MAX_QUOTE_LINES = 30;
export const emptyQuoteLine = (): QuoteLineInput => ({ label: "", cost: "", selling: "" });

const cents = (n: number) => Math.round(n * 100) / 100;

export function quoteTotals(lines: { cost: number; selling: number }[]) {
  const cost = cents(lines.reduce((s, l) => s + l.cost, 0));
  const selling = cents(lines.reduce((s, l) => s + l.selling, 0));
  return { cost, selling, profit: cents(selling - cost) };
}

/** Lines with nothing typed are dropped. */
export const filledQuoteLines = (lines: QuoteLineInput[]) => lines.filter((l) => l.label.trim() || l.cost !== "" || l.selling !== "");

/** Validates lines from a request body. Each needs a description and a cost and selling price ≥ 0. */
export function parseQuoteLines(raw: unknown): { lines: QuoteLine[]; cost: number; profit: number } | { error: string } {
  if (!Array.isArray(raw) || raw.length === 0) return { error: "Add at least one quote line" };
  if (raw.length > MAX_QUOTE_LINES) return { error: `At most ${MAX_QUOTE_LINES} quote lines` };
  const lines: QuoteLine[] = [];
  for (const [i, item] of raw.entries()) {
    const r = (item ?? {}) as Record<string, unknown>;
    const label = typeof r.label === "string" ? r.label.trim().slice(0, 80) : "";
    const cost = Number(r.cost);
    const selling = Number(r.selling);
    if (!label) return { error: `Line ${i + 1}: enter what the charge is for` };
    if (r.cost === "" || r.cost == null || !Number.isFinite(cost) || cost < 0) return { error: `Line ${i + 1}: enter a valid cost` };
    if (r.selling === "" || r.selling == null || !Number.isFinite(selling) || selling < 0) return { error: `Line ${i + 1}: enter a valid selling price` };
    lines.push({ label, cost: cents(cost), selling: cents(selling) });
  }
  const { cost, profit } = quoteTotals(lines);
  return { lines, cost, profit };
}

/** Stored JSON back to lines; anything malformed is ignored. */
export function readQuoteLines(value: unknown): QuoteLine[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((l) => l as Record<string, unknown>)
    .filter((l) => typeof l?.label === "string" && Number.isFinite(Number(l.cost)) && Number.isFinite(Number(l.selling)))
    .map((l) => ({ label: String(l.label), cost: Number(l.cost), selling: Number(l.selling) }));
}
