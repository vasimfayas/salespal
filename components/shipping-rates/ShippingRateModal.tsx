"use client";

import { useEffect, useState } from "react";
import { Plane, Ship, Truck, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { labelClass } from "@/components/ui/field-styles";
import { LocationPicker } from "@/components/enquiries/LocationPicker";
import { convert, type ExchangeRates } from "@/lib/exchange-rates";
import { cn, formatAmount } from "@/lib/utils";
import {
  carriersByMode,
  containerLabel,
  containerTypesByMode,
  currencyTypes,
  DEFAULT_CURRENCY,
  rateUnit,
  type ShippingRateListItem,
} from "@/types/shipping-rate";

interface ShippingRateModalProps {
  rate?: ShippingRateListItem | null;
  open: boolean;
  onClose: () => void;
  onSaved: (rate: ShippingRateListItem) => void;
  fx: ExchangeRates | null;
}

const MODES = [
  { value: "sea", label: <><Ship size={14} aria-hidden /> Sea</> },
  { value: "air", label: <><Plane size={14} aria-hidden /> Air</> },
  { value: "land", label: <><Truck size={14} aria-hidden /> Land</> },
] as const;

/** Place wording per mode, matching what the location picker suggests. */
const PLACE: Record<string, string> = { sea: "port", air: "airport", land: "city" };

const emptyForm = {
  location: "",
  port: "",
  carrier: "",
  currency: DEFAULT_CURRENCY as string,
  mode: "sea",
  container: containerTypesByMode.sea[0],
  price: "",
};

/** Add / edit a freight rate. Mode comes first: it decides the places, carriers and container or weight break offered. */
export function ShippingRateModal({ rate, open, onClose, onSaved, fx }: ShippingRateModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const isEdit = !!rate;
  const place = PLACE[form.mode] ?? "place";
  const carriers = carriersByMode[form.mode] ?? [];

  useEffect(() => {
    if (!open) return;
    setForm(
      rate
        ? {
            location: rate.location,
            port: rate.port,
            carrier: rate.carrier ?? "",
            currency: rate.currency || "USD",
            mode: rate.mode,
            container: rate.container,
            price: String(rate.price),
          }
        : emptyForm,
    );
    setErrorMsg(null);
  }, [open, rate]);

  // Places, carriers and container sizes are mode-specific, so a new mode starts them over.
  function setMode(mode: string) {
    if (mode === form.mode) return;
    setForm({ ...form, mode, location: "", port: "", carrier: "", container: containerTypesByMode[mode][0] });
  }

  const price = Number(form.price);
  const inQar = form.price && form.currency !== "QAR" ? convert(price, form.currency, "QAR", fx) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setIsSaving(true);
    try {
      const res = await fetch(isEdit ? `/api/shipping-rates/${rate!.id}` : "/api/shipping-rates", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, carrier: form.carrier.trim() || null, price }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save rate");
      onSaved(data.rate);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal onClose={onClose} open={open}>
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -right-2 -top-2 cursor-pointer rounded-md p-1.5 text-muted-foreground transition hover:bg-muted"
        >
          <X size={18} />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
            {form.mode === "air" ? <Plane size={20} /> : form.mode === "land" ? <Truck size={20} /> : <Ship size={20} />}
          </span>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">{isEdit ? "Edit freight rate" : "Add freight rate"}</h3>
            <p className="text-xs text-muted-foreground">Pick the mode first. It decides the places, carriers and sizes offered.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm font-medium text-danger-foreground">
              {errorMsg}
            </p>
          )}

          <div>
            <span className={labelClass}>Transport mode</span>
            <SegmentedControl label="Transport mode" value={form.mode as (typeof MODES)[number]["value"]} onChange={setMode} options={MODES} className="grid w-full grid-cols-3" />
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <LocationPicker
              id="rate-from"
              label={`Origin ${place}`}
              required
              strict
              mode={form.mode}
              value={form.location}
              onChange={(location) => setForm((f) => ({ ...f, location }))}
              placeholder={`Search ${place}s`}
            />
            <LocationPicker
              id="rate-to"
              label={`Destination ${place}`}
              required
              strict
              mode={form.mode}
              value={form.port}
              onChange={(port) => setForm((f) => ({ ...f, port }))}
              placeholder={`Search ${place}s`}
            />
          </div>

          <div>
            <Input
              id="rate-carrier"
              label={form.mode === "air" ? "Airline (optional)" : form.mode === "sea" ? "Shipping line (optional)" : "Carrier / transporter (optional)"}
              list={carriers.length ? "rate-carriers" : undefined}
              autoComplete="off"
              value={form.carrier}
              onChange={(e) => setForm({ ...form, carrier: e.target.value })}
              placeholder={carriers.length ? `Search or type, e.g. ${carriers[0]}` : "Transport company"}
            />
            {carriers.length > 0 && (
              <>
                <datalist id="rate-carriers">
                  {carriers.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="ss-type-overline mr-1">Popular:</span>
                  {carriers.slice(0, 6).map((c) => {
                    const on = form.carrier.toLowerCase() === c.toLowerCase();
                    return (
                      <button
                        key={c}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setForm({ ...form, carrier: c })}
                        className={cn(
                          "cursor-pointer rounded-md border px-2 py-0.5 text-[11px] font-semibold transition",
                          on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <Select
            id="rate-container"
            label={form.mode === "air" ? "Weight break (rate per kg)" : "Container"}
            value={form.container}
            onChange={(e) => setForm({ ...form, container: e.target.value })}
          >
            {containerTypesByMode[form.mode].map((c) => (
              <option key={c} value={c}>
                {containerLabel(c)}
              </option>
            ))}
          </Select>

          <div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
              <Input
                id="rate-price"
                label={`Price ${rateUnit(form.container)}`}
                type="number"
                required
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
              />
              </div>
              <Select id="rate-currency" label="Currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                {currencyTypes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            {form.currency !== "QAR" && (
              <p className="mt-1.5 text-xs text-muted-foreground" aria-live="polite">
                {inQar !== null ? (
                  <>
                    ≈ <span className="font-semibold text-foreground">QAR {formatAmount(inQar)}</span> · 1 {form.currency} ={" "}
                    {formatAmount(convert(1, form.currency, "QAR", fx)!)} QAR (live)
                  </>
                ) : fx ? null : (
                  "Live exchange rates are unavailable right now."
                )}
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-border pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSaving}>
              {isEdit ? "Update rate" : "Publish rate"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
