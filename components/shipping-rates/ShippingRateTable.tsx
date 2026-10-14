"use client";

import { buttonVariants } from "@/components/ui/Button";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Ship,
  Plane,
  Truck,
  Search,
  RotateCcw,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  MapPin,
  Anchor,
  ArrowRight,
  ArrowLeftRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Tag,
  Layers,
  AlertCircle,
  Download,
  Trophy,
  Zap,
  Filter,
  ChevronDown,
  Coins,
} from "lucide-react";
import { ShippingRateModal } from "@/components/shipping-rates/ShippingRateModal";
import { Toast } from "@/components/ui/Toast";
import { Badge } from "@/components/ds/Badge";
import { RateCard, type RateCardBadge } from "@/components/ds/RateCard";
import { cn, formatAmount, formatDate, titleCase } from "@/lib/utils";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { convert, type ExchangeRates } from "@/lib/exchange-rates";
import { orderModes } from "@/types/order";
import { containerLabel, containerTypes, containerTypesByMode, currencyTypes, DEFAULT_CURRENCY, rateUnit, type ShippingRateListItem } from "@/types/shipping-rate";

/* ═══════════════════════════════════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════════════════════════════════ */

import type { LucideIcon } from "lucide-react";

interface ShippingRateTableProps {
  initialRates: ShippingRateListItem[];
  editable?: boolean;
  /** Delete buttons (accounts only); defaults to `editable`. */
  canDelete?: boolean;
  /** Live exchange rates; null hides conversion and shows each rate in its own currency. */
  fx: ExchangeRates | null;
}

const MODE_ICON: Record<string, LucideIcon> = {
  air: Plane,
  sea: Ship,
  land: Truck,
};

function formatRatePrice(price: number | string, currency?: string | null): string {
  const formatted = formatAmount(price);
  return !currency || currency === "USD" ? `$${formatted}` : `${currency} ${formatted}`;
}

const formatFx = (n: number) => new Intl.NumberFormat("en", { maximumSignificantDigits: 4 }).format(n);

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export function ShippingRateTable({ initialRates, editable = false, canDelete = editable, fx }: ShippingRateTableProps) {
  const router = useRouter();
  const [rates, setRates] = useState<ShippingRateListItem[]>(initialRates);

  useEffect(() => { setRates(initialRates); }, [initialRates]);

  // ─── Display currency (prices converted with live rates) ───
  const [displayCurrency, setDisplayCurrency] = useState<string>(DEFAULT_CURRENCY);
  /** Price in the display currency, or in its own currency when no live rate is available. */
  function priceOf(r: ShippingRateListItem) {
    const cur = r.currency ?? "USD";
    const v = convert(r.price, cur, displayCurrency, fx);
    return v === null ? { value: r.price, currency: cur } : { value: v, currency: displayCurrency };
  }
  const showPrice = (r: ShippingRateListItem) => { const p = priceOf(r); return formatRatePrice(p.value, p.currency); };
  // Currencies the rates are entered in, for the exchange-rate strip.
  const rateCurrencies = useMemo(() => [...new Set(rates.map((r) => r.currency ?? "USD"))].filter((c) => c !== displayCurrency && fx?.rates[c]), [rates, displayCurrency, fx]);

  // ─── Rate Finder State ───
  const [finderFrom, setFinderFrom] = useState("");
  const [finderTo, setFinderTo] = useState("");
  const [finderContainer, setFinderContainer] = useState("20gp");
  const [finderMode, setFinderMode] = useState("sea");
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedRate, setMatchedRate] = useState<ShippingRateListItem | null>(null);

  // ─── Directory Filter State ───
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [containerFilter, setContainerFilter] = useState("all");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // ─── CRUD State ───
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<ShippingRateListItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // ─── Computed Options ───
  const originOptions = useMemo(() => {
    const s = new Set<string>();
    rates.forEach((r) => { if (r.location?.trim()) s.add(r.location.trim()); });
    return Array.from(s).sort();
  }, [rates]);

  const destinationOptions = useMemo(() => {
    const s = new Set<string>();
    rates.forEach((r) => { if (r.port?.trim()) s.add(r.port.trim()); });
    return Array.from(s).sort();
  }, [rates]);

  const distinctCarriers = useMemo(() => {
    const s = new Set<string>();
    rates.forEach((r) => { if (r.carrier?.trim()) s.add(r.carrier.trim()); });
    return Array.from(s).sort();
  }, [rates]);

  // ─── Smart Defaults ───
  useEffect(() => {
    if (rates.length > 0 && !finderFrom && originOptions.length > 0) {
      setFinderFrom(originOptions.find((o) => o.toLowerCase().includes("jnpt")) || originOptions[0]);
    }
    if (rates.length > 0 && !finderTo && destinationOptions.length > 0) {
      setFinderTo(destinationOptions.find((d) => d.toLowerCase().includes("hamad")) || destinationOptions[0]);
    }
  }, [rates, originOptions, destinationOptions, finderFrom, finderTo]);

  // ─── Rate Finder Logic ───
  function handleFindRate() {
    setHasSearched(true);
    if (!finderFrom || !finderTo) { setMatchedRate(null); return; }
    const from = finderFrom.trim().toLowerCase();
    const to = finderTo.trim().toLowerCase();
    const match = rates.find((r) => {
      const locMatch =
        (r.location.toLowerCase() === from && r.port.toLowerCase() === to) ||
        (r.port.toLowerCase() === from && r.location.toLowerCase() === to);
      if (!locMatch) return false;
      if (r.container !== finderContainer) return false;
      if (finderMode !== "all" && r.mode !== finderMode) return false;
      return true;
    });
    setMatchedRate(match ?? null);
  }

  function handleSwap() {
    const temp = finderFrom;
    setFinderFrom(finderTo);
    setFinderTo(temp);
    if (hasSearched) setTimeout(handleFindRate, 50);
  }

  // ─── Filtered Rates ───
  const filteredRates = useMemo(() => {
    return rates.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!r.location.toLowerCase().includes(q) && !r.port.toLowerCase().includes(q) && !(r.carrier && r.carrier.toLowerCase().includes(q))) return false;
      }
      if (modeFilter !== "all" && r.mode !== modeFilter) return false;
      if (containerFilter !== "all" && r.container !== containerFilter) return false;
      if (carrierFilter !== "all" && (!r.carrier || r.carrier.toLowerCase() !== carrierFilter.toLowerCase())) return false;
      if (currencyFilter !== "all" && (r.currency ?? "USD") !== currencyFilter) return false;
      return true;
    });
  }, [rates, searchQuery, modeFilter, containerFilter, carrierFilter, currencyFilter]);

  // One page at a time — the full list stays in memory for filtering and best-price detection.
  const [PAGE, setPAGE] = useState(20);
  const [page, setPage] = useState(1);
  const [filterKey, setFilterKey] = useState("");
  const currentFilterKey = [searchQuery, modeFilter, containerFilter, carrierFilter, currencyFilter].join("|");
  if (currentFilterKey !== filterKey) {
    setFilterKey(currentFilterKey);
    setPage(1);
  }
  const lastPage = Math.max(1, Math.ceil(filteredRates.length / PAGE));
  const currentPage = Math.min(page, lastPage);
  const visibleRates = filteredRates.slice((currentPage - 1) * PAGE, currentPage * PAGE);

  const hasActiveFilters = searchQuery !== "" || modeFilter !== "all" || containerFilter !== "all" || carrierFilter !== "all" || currencyFilter !== "all";

  function resetFilters() {
    setSearchQuery(""); setModeFilter("all"); setContainerFilter("all"); setCarrierFilter("all"); setCurrencyFilter("all");
  }

  // ─── Find Best Price/Fastest ───
  const bestPriceId = useMemo(() => {
    if (filteredRates.length < 2) return null;
    let best: ShippingRateListItem | null = null;
    // Compare in QAR so rates in different currencies rank fairly.
    const qar = (r: ShippingRateListItem) => convert(r.price, r.currency ?? "USD", "QAR", fx) ?? r.price;
    for (const r of filteredRates) {
      if (!best || qar(r) < qar(best)) {
        best = r;
      }
    }
    return best ? best.id : null;
  }, [filteredRates, fx]);

  // ─── Delete Handler ───
  async function handleDelete(id: number) {
    if (!confirm("Delete this freight rate? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/shipping-rates/${id}`, { method: "DELETE" });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed to delete rate"); }
      setRates((prev) => prev.filter((r) => r.id !== id));
      if (matchedRate?.id === id) setMatchedRate(null);
      triggerToast("Freight rate deleted");
      router.refresh();
    } catch (err: any) {
      triggerToast(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  // ─── Market Range ───
  const MatchedModeIcon = (matchedRate && MODE_ICON[matchedRate.mode]) || Ship;
  const marketRange = (() => {
    if (!matchedRate) return null;
    const p = priceOf(matchedRate);
    return { min: formatRatePrice(Math.round(p.value * 0.924), p.currency), max: formatRatePrice(Math.round(p.value * 1.076), p.currency) };
  })();

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div className="space-y-5 sm:space-y-6" style={{ fontFamily: "var(--ds-font-sans)" }}>
      {toastMsg && <Toast message={toastMsg} />}

      {/* ══════════════════════════════════════════════════
          SECTION 1: FREIGHT RATE FINDER
          ══════════════════════════════════════════════════ */}
      <section className="ss-card overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-primary-soft text-primary-soft-foreground">
              <Ship size={18} aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="text-[15px] font-semibold text-foreground">Freight rate finder</h2>
              <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                Search contract rates across carriers and logistics lanes
              </p>
            </div>
          </div>
          {editable && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => alert("Rate import feature coming soon. You will be able to upload bulk rates via Excel/CSV.")}
                className={buttonVariants({ variant: "secondary", size: "sm" })}
                title="Import shipping rates from CSV or Excel"
              >
                <Download size={13} />
                <span>Import</span>
              </button>
              <button
                type="button"
                onClick={() => { setEditingRate(null); setModalOpen(true); }}
                className={buttonVariants({ size: "sm" })}
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Add Freight Rate</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          )}
        </div>

        {/* Finder Form */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
            {/* Origin */}
            <div className="lg:col-span-4 space-y-1.5">
              <label className="ss-type-label flex items-center gap-1.5">
                <MapPin size={12} style={{ color: "var(--ss-teal-600)" }} />
                From
              </label>
              <div className="relative">
                <select
                  value={finderFrom}
                  onChange={(e) => setFinderFrom(e.target.value)}
                  className="h-11 w-full appearance-none rounded-md pl-3.5 pr-10 text-[13px] font-medium outline-none transition cursor-pointer"
                  style={{ background: "var(--ds-surface-sunken)", border: "1px solid var(--ds-border-default)", color: "var(--ds-text-primary)" }}
                >
                  <option value="">Select origin...</option>
                  {originOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--ds-text-muted)" }} />
              </div>
            </div>

            {/* Swap */}
            <div className="lg:col-span-1 flex justify-center py-0.5 lg:pb-1">
              <button
                type="button"
                onClick={handleSwap}
                title="Swap"
                className="h-9 w-9 flex items-center justify-center rounded-md transition cursor-pointer active:scale-90"
                style={{ background: "var(--ds-surface-sunken)", border: "1px solid var(--ds-border-default)", color: "var(--ds-text-secondary)" }}
              >
                <ArrowLeftRight size={14} className="lg:rotate-0 rotate-90" />
              </button>
            </div>

            {/* Destination */}
            <div className="lg:col-span-4 space-y-1.5">
              <label className="ss-type-label flex items-center gap-1.5">
                <Anchor size={12} style={{ color: "var(--ss-blue-600)" }} />
                To
              </label>
              <div className="relative">
                <select
                  value={finderTo}
                  onChange={(e) => setFinderTo(e.target.value)}
                  className="h-11 w-full appearance-none rounded-md pl-3.5 pr-10 text-[13px] font-medium outline-none transition cursor-pointer"
                  style={{ background: "var(--ds-surface-sunken)", border: "1px solid var(--ds-border-default)", color: "var(--ds-text-primary)" }}
                >
                  <option value="">Select destination...</option>
                  {destinationOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--ds-text-muted)" }} />
              </div>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-3">
              <button
                type="button"
                onClick={handleFindRate}
                disabled={!finderFrom || !finderTo}
                className="h-11 w-full inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "var(--ds-color-brand)", color: "var(--ds-text-inverse)" }}
              >
                <Search size={15} />
                Find Rate
              </button>
            </div>
          </div>

          {/* Container + Mode selectors */}
          <div className="mt-4 pt-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6" style={{ borderTop: "1px solid var(--ds-border-subtle)" }}>
            {/* Container */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="ss-type-overline shrink-0">{finderMode === "air" ? "Weight" : "Container"}</span>
              <div className="inline-flex rounded-md p-0.5" style={{ background: "var(--ds-surface-sunken)", border: "1px solid var(--ds-border-default)" }}>
                {containerTypesByMode[finderMode].map((id) => ({ id, label: containerLabel(id) })).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => { setFinderContainer(c.id); if (hasSearched) setTimeout(handleFindRate, 50); }}
                    className={cn(
                      "px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer",
                      finderContainer === c.id
                        ? "bg-card shadow-sm"
                        : "hover:bg-muted",
                    )}
                    style={{ color: finderContainer === c.id ? "var(--ds-text-primary)" : "var(--ds-text-secondary)" }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div className="flex items-center gap-2">
              <span className="ss-type-overline shrink-0">Mode</span>
              <div className="inline-flex gap-1">
                {[
                  { id: "sea", label: "Sea", icon: Ship },
                  { id: "air", label: "Air", icon: Plane },
                  { id: "land", label: "Land", icon: Truck },
                ].map((m) => {
                  const Icon = m.icon;
                  const active = finderMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setFinderMode(m.id);
                        if (!containerTypesByMode[m.id].includes(finderContainer)) setFinderContainer(containerTypesByMode[m.id][0]);
                        if (hasSearched) setTimeout(handleFindRate, 50);
                      }}
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer",
                      )}
                      style={{
                        background: active ? "var(--ds-surface-header)" : "transparent",
                        color: active ? "var(--ds-text-inverse)" : "var(--ds-text-secondary)",
                        border: active ? "none" : "1px solid var(--ds-border-default)",
                      }}
                    >
                      <Icon size={12} />
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            RESULT CARD
            ═══════════════════════════════════════════ */}
        {hasSearched && (
          <div className="px-4 sm:px-6 pb-5 sm:pb-6" style={{ borderTop: "1px solid var(--ds-border-subtle)" }}>
            <div className="pt-4 sm:pt-5">
              {matchedRate ? (
                <div className="ss-card-elevated p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                    {/* Left: Route info */}
                    <div className="lg:col-span-7 space-y-3">
                      {/* Badges row */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge label="Active Rate" variant="positive" icon={CheckCircle2} />
                        {matchedRate.carrier && (
                          <Badge label={matchedRate.carrier} variant="neutral" icon={Tag} />
                        )}
                        <Badge
                          label={titleCase(matchedRate.mode)}
                          variant="info"
                          icon={MODE_ICON[matchedRate.mode] ?? Ship}
                        />
                      </div>

                      {/* Route */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <MapPin size={16} style={{ color: "var(--ss-teal-600)" }} className="shrink-0" />
                          <span className="text-sm sm:text-base font-semibold truncate" style={{ color: "var(--ds-text-primary)" }}>
                            {matchedRate.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0" style={{ color: "var(--ds-text-muted)" }}>
                          <span className="h-px w-4 sm:w-8" style={{ background: "var(--ds-border-strong)" }} />
                          <ArrowRight size={14} />
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <MatchedModeIcon size={16} style={{ color: "var(--ss-blue-600)" }} className="shrink-0" aria-hidden />
                          <span className="text-sm sm:text-base font-semibold truncate" style={{ color: "var(--ds-text-primary)" }}>
                            {matchedRate.port}
                          </span>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-3 ss-type-caption">
                        <span className="ss-badge ss-badge-neutral text-[11px]">
                          {containerLabel(matchedRate.container)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} style={{ color: "var(--ds-text-muted)" }} />
                          {formatDate(matchedRate.updated_at)}
                        </span>
                      </div>
                    </div>

                    {/* Right: Pricing panel */}
                    <div className="lg:col-span-5 ss-card p-4 sm:p-5 space-y-3">
                      <div>
                        <span className="ss-type-overline block">Contract Rate</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="ss-type-price-hero text-[28px] sm:text-[36px]">
                            {showPrice(matchedRate)}
                          </span>
                          <span className="ss-type-caption">{rateUnit(matchedRate.container)}</span>
                        </div>
                      </div>

                      {marketRange && (
                        <div className="pt-3 flex items-center justify-between gap-2" style={{ borderTop: "1px solid var(--ds-border-subtle)" }}>
                          <div className="min-w-0">
                            <span className="ss-type-overline flex items-center gap-1">
                              <TrendingUp size={11} style={{ color: "var(--ss-teal-600)" }} />
                              Market Range
                            </span>
                            <span className="ss-type-price-sm block mt-0.5 ss-tabular">
                              {marketRange.min} — {marketRange.max}
                            </span>
                          </div>
                          <Badge label="Est. Index" variant="neutral" />
                        </div>
                      )}

                      {editable && (
                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => { setEditingRate(matchedRate); setModalOpen(true); }}
                            className="text-xs font-semibold inline-flex items-center gap-1 transition cursor-pointer"
                            style={{ color: "var(--ds-color-brand)" }}
                          >
                            <Edit3 size={12} />
                            Modify rate
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* No match */
                <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center space-y-2 rounded-lg" style={{ background: "var(--ds-surface-sunken)", border: "1px dashed var(--ds-border-default)" }}>
                  <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ background: "var(--ds-status-warning-bg)", color: "var(--ds-status-warning-text)" }}>
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-semibold" style={{ color: "var(--ds-text-primary)" }}>No rate found</h4>
                    <p className="text-xs mt-0.5" style={{ color: "var(--ds-text-secondary)" }}>
                      No active rate for <b>{finderFrom}</b> → <b>{finderTo}</b> ({containerLabel(finderContainer)})
                    </p>
                  </div>
                  {editable && (
                    <button
                      type="button"
                      onClick={() => { setEditingRate(null); setModalOpen(true); }}
                      className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition cursor-pointer"
                      style={{ background: "var(--ds-color-brand)", color: "var(--ds-text-inverse)" }}
                    >
                      <Plus size={13} />
                      Create Rate
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION DIVIDER
          ══════════════════════════════════════════════════ */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full" style={{ borderTop: "1px solid var(--ds-border-default)" }} />
        </div>
        <div className="relative flex justify-center">
          <Badge
            label={`Rate Directory · ${filteredRates.length} ${filteredRates.length === 1 ? "rate" : "rates"}`}
            variant="neutral"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 2: RATE DIRECTORY
          ══════════════════════════════════════════════════ */}
      <section className="space-y-3">
        {/* Display currency + live exchange rates */}
        <div className="ss-card flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
          <div className="flex items-center gap-2">
            <Coins size={15} className="shrink-0 text-muted-foreground" aria-hidden />
            <label htmlFor="rate-display-currency" className="ss-type-overline shrink-0">Show prices in</label>
            <Select
              id="rate-display-currency"
              value={displayCurrency}
              onChange={(e) => setDisplayCurrency(e.target.value)}
              disabled={!fx}
              className="h-8 w-24 text-[13px] font-semibold"
            >
              {currencyTypes.filter((c) => !fx || fx.rates[c]).map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <p className="min-w-0 text-xs text-muted-foreground ss-tabular" aria-live="polite">
            {!fx ? (
              "Live exchange rates are unavailable, so each rate shows in the currency it was entered in."
            ) : (
              <>
                {rateCurrencies.map((c) => (
                  <span key={c} className="mr-3 inline-block">
                    1 {c} = <span className="font-semibold text-foreground">{formatFx(convert(1, c, displayCurrency, fx)!)}</span> {displayCurrency}
                  </span>
                ))}
                <span className="inline-block">Live rates · updated {formatDate(fx.updatedAt)}</span>
              </>
            )}
          </p>
        </div>

        {/* Search + Filters */}
        <div className="ss-card overflow-hidden">
          {/* Search */}
          <div className="p-3 sm:p-4">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--ds-text-muted)" }} />
              <input
                type="text"
                placeholder="Search origin, port, carrier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-md pl-9 pr-4 text-[13px] font-medium outline-none transition"
                style={{
                  background: "var(--ds-surface-sunken)",
                  border: "1px solid var(--ds-border-default)",
                  color: "var(--ds-text-primary)",
                }}
              />
            </div>
          </div>

          {/* Filter toggle (mobile) */}
          <div className="md:hidden px-3 pb-3" style={{ borderTop: "1px solid var(--ds-border-subtle)" }}>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full h-9 flex items-center justify-center gap-1.5 text-xs font-semibold transition cursor-pointer"
              style={{ color: "var(--ds-text-secondary)" }}
            >
              <Filter size={12} />
              {showFilters ? "Hide Filters" : "Filters"}
              {hasActiveFilters && (
                <span className="ml-1 h-4 min-w-4 px-1 rounded-full text-[9px] font-semibold flex items-center justify-center" style={{ background: "var(--ds-color-brand)", color: "var(--ds-text-inverse)" }}>!</span>
              )}
            </button>
          </div>

          {/* Filter pills */}
          <div
            className={cn(
              "px-3 sm:px-4 pb-3 sm:pb-4 pt-2",
              "md:block",
              showFilters ? "block" : "hidden",
            )}
            style={{ borderTop: "1px solid var(--ds-border-subtle)" }}
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Mode */}
              <div className="flex items-center gap-1.5">
                <span className="ss-type-overline">Mode</span>
                <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} className="ss-filter-select">
                  <option value="all">All</option>
                  {orderModes.map((m) => <option key={m} value={m}>{titleCase(m)}</option>)}
                </select>
              </div>

              {/* Container */}
              <div className="flex items-center gap-1.5">
                <span className="ss-type-overline">Size</span>
                <select value={containerFilter} onChange={(e) => setContainerFilter(e.target.value)} className="ss-filter-select">
                  <option value="all">All</option>
                  {containerTypes.map((c) => <option key={c} value={c}>{containerLabel(c)}</option>)}
                </select>
              </div>

              {/* Carrier */}
              <div className="flex items-center gap-1.5">
                <span className="ss-type-overline">Carrier</span>
                <select value={carrierFilter} onChange={(e) => setCarrierFilter(e.target.value)} className="ss-filter-select">
                  <option value="all">All</option>
                  {distinctCarriers.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Currency */}
              <div className="flex items-center gap-1.5">
                <span className="ss-type-overline">Currency</span>
                <select value={currencyFilter} onChange={(e) => setCurrencyFilter(e.target.value)} className="ss-filter-select">
                  <option value="all">All</option>
                  {currencyTypes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Reset */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-8 px-2.5 text-xs font-semibold rounded-md flex items-center gap-1 transition ml-auto cursor-pointer"
                  style={{ color: "var(--ds-status-negative-text)", border: "1px solid var(--ds-border-default)" }}
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            DATA — Mobile Cards + Desktop Table
            ═══════════════════════════════════════════ */}
        {filteredRates.length > 0 ? (
          <>
            <Pagination page={currentPage} pageSize={PAGE} total={filteredRates.length} noun="rates" onPage={setPage} onSize={(n) => { setPAGE(n); setPage(1); }} />
            {/* ── MOBILE: Rate Cards ── */}
            <div className="md:hidden space-y-2.5">
              {visibleRates.map((rate) => {
                const cardBadge: RateCardBadge = rate.id === bestPriceId ? "best-price" : "none";
                return (
                  <RateCard
                    key={rate.id}
                    carrier={rate.carrier}
                    container={rate.container}
                    price={showPrice(rate)}
                    unit={rateUnit(rate.container)}
                    mode={rate.mode}
                    origin={rate.location}
                    destination={rate.port}
                    updatedAt={rate.updated_at}
                    updatedBy={rate.updatedBy?.name}
                    badge={cardBadge}
                    editable={editable}
                    onEdit={() => { setEditingRate(rate); setModalOpen(true); }}
                    onDelete={canDelete ? () => handleDelete(rate.id) : undefined}
                    isDeleting={deletingId === rate.id}
                  />
                );
              })}
            </div>

            {/* ── DESKTOP: ShipShape Rate Table ── */}
            <div className="hidden md:block ss-table-surface">
              <div className="overflow-x-auto">
              <table className="ss-rate-table">
                <thead>
                  <tr>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Carrier</th>
                    <th>Mode</th>
                    <th>Container</th>
                    <th>Rate</th>
                    <th>Updated</th>
                    {editable && <th style={{ width: 80, textAlign: "right" }}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {visibleRates.map((rate) => {
                    const isBest = rate.id === bestPriceId;
                    const ModeIcon = MODE_ICON[rate.mode] ?? Ship;
                    return (
                      <tr key={rate.id}>
                        {/* Origin */}
                        <td>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={13} style={{ color: "var(--ss-teal-600)" }} className="shrink-0" />
                            <span className="font-semibold">{rate.location}</span>
                          </span>
                        </td>

                        {/* Destination */}
                        <td>
                          <span className="flex items-center gap-1.5">
                            <ModeIcon size={13} style={{ color: "var(--ss-blue-600)" }} className="shrink-0" aria-hidden />
                            <span className="font-medium">{rate.port}</span>
                          </span>
                        </td>

                        {/* Carrier */}
                        <td>
                          {rate.carrier ? (
                            <span className="ss-carrier-name text-[13px]">{rate.carrier}</span>
                          ) : (
                            <span className="ss-type-caption italic">—</span>
                          )}
                        </td>

                        {/* Mode */}
                        <td>
                          <Badge
                            label={titleCase(rate.mode)}
                            variant={rate.mode === "sea" ? "accent" : rate.mode === "air" ? "info" : "warning"}
                            icon={ModeIcon}
                          />
                        </td>

                        {/* Container */}
                        <td>
                          <Badge label={containerLabel(rate.container)} variant="neutral" />
                        </td>

                        {/* Price */}
                        <td>
                          <span className="flex items-center gap-2">
                            <span className={cn("ss-type-price-md ss-tabular", isBest && "ss-price-best")}>{showPrice(rate)}</span>
                            {isBest && <Badge label="Best" variant="positive" icon={Trophy} />}
                          </span>
                          <span className="block ss-type-caption">{rateUnit(rate.container)}</span>
                        </td>

                        {/* Updated */}
                        <td>
                          <span className="ss-type-caption ss-tabular">{formatDate(rate.updated_at)}</span>
                          {rate.updatedBy?.name && (
                            <span className="block ss-type-overline" style={{ fontSize: "0.6rem" }}>
                              by {rate.updatedBy.name}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        {editable && (
                          <td style={{ textAlign: "right" }}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => { setEditingRate(rate); setModalOpen(true); }}
                                className="p-1.5 rounded-md transition cursor-pointer"
                                style={{ color: "var(--ds-text-muted)" }}
                                title="Edit"
                              >
                                <Edit3 size={14} />
                              </button>
                              {canDelete && (
                              <button
                                type="button"
                                onClick={() => handleDelete(rate.id)}
                                disabled={deletingId === rate.id}
                                className="p-1.5 rounded-md transition cursor-pointer disabled:opacity-50"
                                style={{ color: "var(--ds-text-muted)" }}
                                title="Delete"
                              >
                                {deletingId === rate.id ? (
                                  <Loader2 size={14} className="animate-spin" style={{ color: "var(--ds-status-negative-text)" }} />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </div>
            <Pagination page={currentPage} pageSize={PAGE} total={filteredRates.length} noun="rates" onPage={setPage} onSize={(n) => { setPAGE(n); setPage(1); }} />
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-2.5 rounded-lg" style={{ background: "var(--ds-surface-card)", border: "1px dashed var(--ds-border-default)" }}>
            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: "var(--ds-surface-sunken)", color: "var(--ds-text-muted)" }}>
              <Search size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--ds-text-primary)" }}>
                {rates.length === 0 ? "No freight rates yet" : "No rates match your filters"}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--ds-text-secondary)" }}>
                {rates.length === 0
                  ? "Add your first rate to start quoting clients."
                  : "Try different search terms or clear filters."}
              </p>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition cursor-pointer"
                style={{ background: "var(--ds-color-brand)", color: "var(--ds-text-inverse)" }}
              >
                <RotateCcw size={12} />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════
          MODAL
          ══════════════════════════════════════════════════ */}
      {editable && (
        <ShippingRateModal
          rate={editingRate}
          fx={fx}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSaved={(saved) => {
            setRates((prev) => {
              const exists = prev.some((r) => r.id === saved.id);
              return exists ? prev.map((r) => (r.id === saved.id ? saved : r)) : [saved, ...prev];
            });
            if (matchedRate && matchedRate.id === saved.id) setMatchedRate(saved);
            triggerToast(editingRate ? "Rate updated" : "Rate added");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
