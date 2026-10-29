import { randomBytes } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { queueEmail } from "@/lib/email-queue";
import { renderEmail, type EmailTemplate } from "@/lib/email-templates";
import { publicBaseUrl } from "@/lib/public-url";
import { dimensionUnitLabels, readPackages, type DimensionUnit } from "@/lib/freight";
import { equipmentLabel, formatTemp, incotermNames, jobRefNames, type Incoterm, type JobRef } from "@/types/enquiry";

/**
 * "Send to agent": the agent gets an emailed link (/agent-quote/<token>) with the shipment details and gives their cost.
 * The link works until they reply or this many days pass.
 */
export const AGENT_LINK_VALID_DAYS = 30;

export const newAgentToken = () => randomBytes(24).toString("base64url");
export const agentQuotePath = (token: string) => `/agent-quote/${token}`;
export const agentQuoteUrl = (token: string, request: Request) => new URL(agentQuotePath(token), publicBaseUrl(request)).toString();
export const agentLinkExpired = (sentAt: Date) => Date.now() - sentAt.getTime() > AGENT_LINK_VALID_DAYS * 86_400_000;

/** Enquiry fields the agent sees — the shipment only, never the client. */
export const agentEnquirySelect = {
  id: true,
  mode: true,
  from: true,
  to: true,
  collection_address: true,
  job_ref: true,
  incoterm: true,
  clearance: true,
  is_dg: true,
  un_number: true,
  packages: true,
  dimension_unit: true,
  actual_weight: true,
  weight_unit: true,
  stackable: true,
  chargeable_weight: true,
  cbm: true,
  service_type: true,
  reefer_temp: true,
  gauge: true,
  truck_type: true,
  notes: true,
  organization: { select: { id: true, name: true, prefix: true, logo_path: true } },
} satisfies Prisma.EnquirySelect;

type AgentEnquiry = Prisma.EnquiryGetPayload<{ select: typeof agentEnquirySelect }>;

const MODE: Record<string, string> = { sea: "Sea", air: "Air", land: "Road" };
const qty = (v: number) => new Intl.NumberFormat("en", { maximumFractionDigits: 3 }).format(v);

/** The shipment as label / value rows, for the agent's email and page. Empty values are left out. */
export function agentShipmentRows(e: AgentEnquiry): [string, string][] {
  const unit = (e.dimension_unit ?? "cm") as DimensionUnit;
  const packages = readPackages(e.packages);
  const rows: [string, string | null][] = [
    ["Mode", MODE[e.mode] ?? e.mode],
    ["From", e.from],
    ["To", e.to],
    ["Pickup address", e.collection_address],
    ["Job type", e.job_ref ? `${e.job_ref} · ${jobRefNames[e.job_ref as JobRef] ?? ""}` : null],
    ["Incoterm", e.incoterm ? `${e.incoterm} · ${incotermNames[e.incoterm as Incoterm] ?? ""}` : null],
    ["Equipment", equipmentLabel(e)],
    ["Reefer temperature", e.reefer_temp !== null ? formatTemp(e.reefer_temp.toNumber()) : null],
    [
      "Packages",
      packages.length
        ? packages.map((p) => `${p.qty} × ${qty(p.length)} × ${qty(p.width)} × ${qty(p.height)} ${dimensionUnitLabels[unit] ?? unit}`).join("; ")
        : null,
    ],
    ["Gross weight", e.actual_weight !== null ? `${qty(e.actual_weight.toNumber())} kg` : null],
    ["Volume", e.cbm !== null ? `${qty(e.cbm.toNumber())} m³` : null],
    ["Chargeable weight", e.chargeable_weight !== null ? `${qty(e.chargeable_weight.toNumber())} kg` : null],
    ["Stackable", e.stackable === null ? null : e.stackable ? "Yes" : "No"],
    ["Dangerous goods", e.is_dg ? `Yes${e.un_number ? ` (${e.un_number})` : ""}` : "No"],
    ["Customs clearance", e.clearance ? "Required" : "Not required"],
    ["Notes", e.notes],
  ];
  return rows.filter((r): r is [string, string] => !!r[1]);
}

/** Queues the agent's rate request email, worded by the template (the company's, or one edited for this send); returns the email job id. */
export function sendAgentRequestEmail(m: { to: string; template: EmailTemplate; contactName: string | null; ref: string; enquiry: AgentEnquiry; senderName: string; url: string }) {
  const mail = renderEmail("agent_rate_request", m.template, {
    logo_src: m.enquiry.organization.logo_path ? "cid:logo" : null,
    contact_name: m.contactName,
    company: m.enquiry.organization.name,
    ref: m.ref,
    sender: m.senderName,
    link: m.url,
    valid_days: AGENT_LINK_VALID_DAYS,
    shipment: agentShipmentRows(m.enquiry),
  });
  return queueEmail({ kind: "agent_rate_request", to: m.to, ...mail, logoPath: m.enquiry.organization.logo_path });
}
