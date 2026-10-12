/** What a rate is priced on, per mode: sea and land per container, air per kg within a weight break. */
export const containerTypesByMode: Record<string, readonly string[]> = {
  sea: ["20gp", "40hc"],
  land: ["20gp", "40hc"],
  air: ["0-45", "45-100", "100-300", "300-500", "500-1000", "1000+"],
};
export const containerTypes = [...new Set(Object.values(containerTypesByMode).flat())];
export type ContainerType = string;

const CONTAINER_LABELS: Record<string, string> = { "20gp": "20FT", "40hc": "40FT HC", "1000+": "1000+ kg" };
export function containerLabel(container: string) {
  return CONTAINER_LABELS[container] ?? (/^\d+-\d+$/.test(container) ? `${container.replace("-", "–")} kg` : container.toUpperCase());
}

/** "per kg" for air weight breaks, "per container" otherwise (older air rates were entered per container). */
export const rateUnit = (container: string) => (containerTypesByMode.air.includes(container) ? "per kg" : "per container");

export const commonCarriers = ["MSC", "Maersk", "CMA CGM", "COSCO", "Hapag-Lloyd", "ONE", "Evergreen", "Yang Ming", "HMM", "ZIM"] as const;

export const airCarriers = [
  "Qatar Airways Cargo",
  "Emirates SkyCargo",
  "Etihad Cargo",
  "Saudia Cargo",
  "Turkish Cargo",
  "Lufthansa Cargo",
  "Cathay Cargo",
  "Singapore Airlines Cargo",
  "Cargolux",
  "Air France KLM Martinair Cargo",
  "IAG Cargo",
  "Korean Air Cargo",
  "China Airlines Cargo",
  "Air India Cargo",
  "Oman Air Cargo",
  "Gulf Air Cargo",
  "Kuwait Airways Cargo",
  "flydubai Cargo",
  "FedEx Express",
  "DHL Aviation",
  "UPS Airlines",
] as const;

export const carriersByMode: Record<string, readonly string[]> = { sea: commonCarriers, air: airCarriers, land: [] };

export const currencyTypes = ["QAR", "USD", "EUR", "GBP", "AED", "SAR", "OMR", "KWD", "BHD", "INR", "CNY"] as const;
export type CurrencyType = (typeof currencyTypes)[number];
export const DEFAULT_CURRENCY: CurrencyType = "QAR";

export type ShippingRateListItem = {
  id: number;
  location: string;
  port: string;
  carrier?: string | null;
  currency?: CurrencyType | string | null;
  mode: string;
  container: ContainerType;
  price: number;
  updated_by_id: number;
  created_at: string | Date;
  updated_at: string | Date;
  updatedBy?: { name: string };
};
