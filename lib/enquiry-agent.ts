import { randomBytes } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { escapeHtml, sendMail } from "@/lib/mailer";
import { dimensionUnitLabels, readPackages, type DimensionUnit } from "@/lib/freight";
import { equipmentLabel, formatTemp, incotermNames, jobRefNames, type Incoterm, type JobRef } from "@/types/enquiry";

/**
 * "Send to agent": the agent gets an emailed link (/agent-quote/<token>) with the shipment details and gives their cost.
 * The link works until they reply or this many days pass.
 */
export const AGENT_LINK_VALID_DAYS = 30;

export const newAgentToken = () => randomBytes(24).toString("base64url");
export const agentQuotePath = (token: string) => `/agent-quote/${token}`;
export const agentQuoteUrl = (token: string, requestUrl: string) =>
  new URL(agentQuotePath(token), process.env.APP_URL || new URL(requestUrl).origin).toString();
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

/** Emails the agent their rate request. False when email isn't configured; throws when the SMTP server refuses it. */
export function sendAgentRequestEmail(m: { to: string; contactName: string | null; ref: string; enquiry: AgentEnquiry; senderName: string; url: string }) {
  const company = m.enquiry.organization.name;
  const rows = agentShipmentRows(m.enquiry);
  const hello = m.contactName ? `Dear ${m.contactName},` : "Hello,";
  const text = [
    hello,
    "",
    `${company} would like your rate for this shipment (${m.ref}):`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    `Add your cost here: ${m.url}`,
    `The link works for ${AGENT_LINK_VALID_DAYS} days.`,
    "",
    m.senderName,
    company,
  ].join("\n");
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#1a1f29;max-width:600px">
      <p>${escapeHtml(hello)}</p>
      <p><strong>${escapeHtml(company)}</strong> would like your rate for this shipment (${escapeHtml(m.ref)}):</p>
      <table cellpadding="6" style="border-collapse:collapse;width:100%;font-size:13px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="border-bottom:1px solid #e5e7eb;color:#6b7280;width:38%;vertical-align:top">${escapeHtml(k)}</td><td style="border-bottom:1px solid #e5e7eb">${escapeHtml(v)}</td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:24px 0">
        <a href="${escapeHtml(m.url)}" style="background:#0f7370;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block;font-weight:bold">Add your cost</a>
      </p>
      <p style="color:#6b7280;font-size:12px">The link works for ${AGENT_LINK_VALID_DAYS} days. If the button doesn't work, copy this address into your browser:<br>${escapeHtml(m.url)}</p>
      <p>${escapeHtml(m.senderName)}<br>${escapeHtml(company)}</p>
    </div>`;
  return sendMail({ to: m.to, subject: `Rate request ${m.ref} — ${company}`, text, html });
}
