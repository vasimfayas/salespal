import { currencyTypes } from "@/types/shipping-rate";

/** Units of each currency per 1 QAR, plus when the source last updated. */
export type ExchangeRates = { rates: Record<string, number>; updatedAt: string };

/**
 * Live QAR exchange rates (open.er-api.com, free, no key), cached by Next for 6 hours.
 * Null when the service can't be reached, so pages still render without conversion.
 */
export async function getExchangeRates(): Promise<ExchangeRates | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/QAR", { next: { revalidate: 21600 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.result !== "success") return null;
    const rates = Object.fromEntries(currencyTypes.filter((c) => typeof data.rates?.[c] === "number").map((c) => [c, data.rates[c] as number]));
    return { rates, updatedAt: data.time_last_update_utc };
  } catch {
    return null;
  }
}

/** `amount` in `from` → `to`; null when either rate is missing. */
export function convert(amount: number, from: string, to: string, fx: ExchangeRates | null): number | null {
  if (from === to) return amount;
  const a = fx?.rates[from];
  const b = fx?.rates[to];
  return a && b ? (amount / a) * b : null;
}
