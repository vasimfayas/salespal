/**
 * Prisma Decimal → number, treating a missing value as `fallback` (0).
 * Money columns are NOT NULL in the schema, but databases migrated by hand can still hold NULLs
 * (e.g. a column added without a default), and one bad row must not crash a whole page.
 */
export function num(value: { toNumber(): number } | null | undefined, fallback = 0): number {
  return value?.toNumber() ?? fallback;
}
