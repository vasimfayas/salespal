"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { controlBase, controlHeight } from "@/components/ui/field-styles";
import { cn, formatAmount } from "@/lib/utils";
import { emptyQuoteLine, filledQuoteLines, MAX_QUOTE_LINES, quoteTotals, type QuoteLineInput } from "@/lib/quote-lines";

/** Itemised quote editor: charge · cost · selling per line, with profit = selling − cost below. */
export function QuoteLinesField({
  lines,
  onChange,
  required = false,
  autoFocus = false,
}: {
  lines: QuoteLineInput[];
  onChange: (lines: QuoteLineInput[]) => void;
  /** Every filled line needs all three fields; with `required` the first line does too. */
  required?: boolean;
  autoFocus?: boolean;
}) {
  const set = (i: number, patch: Partial<QuoteLineInput>) => onChange(lines.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const filled = filledQuoteLines(lines);
  const totals = quoteTotals(filled.map((l) => ({ cost: Number(l.cost) || 0, selling: Number(l.selling) || 0 })));

  return (
    <div className="space-y-2">
      <div className="hidden grid-cols-[1fr_7rem_7rem_2rem] gap-2 px-0.5 text-xs font-medium text-muted-foreground sm:grid">
        <span>Charge</span>
        <span className="text-right">Cost</span>
        <span className="text-right">Selling</span>
        <span />
      </div>
      {lines.map((l, i) => {
        // A line someone started must be complete; untouched extra lines are ignored.
        const needed = (required && i === 0) || !!(l.label.trim() || l.cost !== "" || l.selling !== "");
        return (
          <div
            key={i}
            className="grid grid-cols-[1fr_1fr_2rem] gap-2 border-b border-border/60 pb-2 last:border-0 sm:grid-cols-[1fr_7rem_7rem_2rem] sm:border-0 sm:pb-0"
          >
            <input
              aria-label={`Line ${i + 1} charge`}
              placeholder="e.g. Transport"
              maxLength={80}
              required={needed}
              autoFocus={autoFocus && i === 0}
              value={l.label}
              onChange={(e) => set(i, { label: e.target.value })}
              className={cn(controlBase, controlHeight, "col-span-3 sm:col-span-1")}
            />
            <input
              aria-label={`Line ${i + 1} cost`}
              placeholder="Cost"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              required={needed}
              value={l.cost}
              onChange={(e) => set(i, { cost: e.target.value })}
              className={cn(controlBase, controlHeight, "text-right tabular-nums")}
            />
            <input
              aria-label={`Line ${i + 1} selling price`}
              placeholder="Selling"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              required={needed}
              value={l.selling}
              onChange={(e) => set(i, { selling: e.target.value })}
              className={cn(controlBase, controlHeight, "text-right tabular-nums")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="self-center"
              aria-label={`Remove line ${i + 1}`}
              disabled={lines.length === 1}
              onClick={() => onChange(lines.filter((_, j) => j !== i))}
            >
              <Trash2 />
            </Button>
          </div>
        );
      })}
      <Button type="button" variant="ghost" size="sm" disabled={lines.length >= MAX_QUOTE_LINES} onClick={() => onChange([...lines, emptyQuoteLine()])}>
        <Plus /> Add line
      </Button>

      <dl className="space-y-1 rounded-control bg-subtle px-3 py-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Total cost</dt>
          <dd className="tabular-nums text-foreground">{formatAmount(totals.cost)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Quoted price (selling)</dt>
          <dd className="font-semibold tabular-nums text-foreground">{formatAmount(totals.selling)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-1">
          <dt className="text-muted-foreground">
            Profit <span className="text-xs">({formatAmount(totals.selling)} − {formatAmount(totals.cost)})</span>
          </dt>
          <dd className={totals.profit < 0 ? "font-semibold tabular-nums text-danger-foreground" : "font-semibold tabular-nums text-success-foreground"}>
            {formatAmount(totals.profit)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

/** Body payload: the filled lines as numbers. */
export const quoteLinesPayload = (lines: QuoteLineInput[]) =>
  filledQuoteLines(lines).map((l) => ({
    label: l.label.trim(),
    cost: Number(l.cost),
    selling: Number(l.selling),
  }));
