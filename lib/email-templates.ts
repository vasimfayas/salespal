/** Email templates: built-in wording, placeholders and rendering. Pure, safe on client and server. */

export const EMAIL_TEMPLATE_KEYS = ["agent_rate_request", "client_enquiry_form"] as const;
export type EmailTemplateKey = (typeof EMAIL_TEMPLATE_KEYS)[number];
export type EmailTemplate = { subject: string; body: string };

export const isTemplateKey = (k: unknown): k is EmailTemplateKey => (EMAIL_TEMPLATE_KEYS as readonly string[]).includes(k as string);

const COMMON = [
  { token: "greeting", hint: "“Dear Ali,” or “Hello,”" },
  { token: "company", hint: "Your company name" },
  { token: "ref", hint: "Enquiry ID" },
  { token: "sender", hint: "Name of the person sending" },
  { token: "link", hint: "The link (shown as a button). Required." },
  { token: "valid_days", hint: "Days the link works" },
  { token: "logo", hint: "The company logo, if it has one" },
];

export const emailTemplateMeta: Record<EmailTemplateKey, { label: string; description: string; linkLabel: string; placeholders: { token: string; hint: string }[] }> = {
  agent_rate_request: {
    label: "Rate request to agent",
    description: "Sent to each agent when an enquiry is sent to them for a rate.",
    linkLabel: "Add your cost",
    placeholders: [...COMMON, { token: "shipment", hint: "The shipment details table (never the client's name)" }],
  },
  client_enquiry_form: {
    label: "Enquiry form to client",
    description: "Sent to a client with the link to fill in and sign their enquiry form.",
    linkLabel: "Fill in the enquiry form",
    placeholders: COMMON,
  },
};

export const EMAIL_DEFAULTS: Record<EmailTemplateKey, EmailTemplate> = {
  agent_rate_request: {
    subject: "Rate request {{ref}} — {{company}}",
    body: `{{greeting}}

{{company}} would like your rate for this shipment ({{ref}}):

{{shipment}}

{{link}}

The link works for {{valid_days}} days.

{{sender}}
{{company}}

{{logo}}`,
  },
  client_enquiry_form: {
    subject: "Freight enquiry form {{ref}} — {{company}}",
    body: `{{greeting}}

{{company}} has sent you a freight enquiry form ({{ref}}). Fill in your shipment details and sign at the end.

{{link}}

The link works for {{valid_days}} days. We'll send you a quote once we receive it.

{{sender}}
{{company}}

{{logo}}`,
  },
};

export type EmailVars = {
  contact_name?: string | null;
  company: string;
  ref: string;
  sender: string;
  link: string;
  valid_days: number;
  /** Where the company logo image is (a URL, or "cid:logo" for an attached one); none = {{logo}} shows nothing. */
  logo_src?: string | null;
  /** Label / value rows for {{shipment}}. */
  shipment?: [string, string][];
};

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const TOKEN = /\{\{\s*(\w+)\s*\}\}/g;
const BUTTON = "background:#0f7370;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block;font-weight:bold";

/** Fills the placeholders: the subject and a plain-text body, plus an inline-styled HTML body (blank line = new paragraph). */
export function renderEmail(key: EmailTemplateKey, t: EmailTemplate, v: EmailVars) {
  const label = emailTemplateMeta[key].linkLabel;
  const name = v.contact_name && v.contact_name !== "-" ? v.contact_name : "";
  const plain: Record<string, string> = {
    greeting: name ? `Dear ${name},` : "Hello,",
    contact_name: name,
    company: v.company,
    ref: v.ref,
    sender: v.sender,
    link: v.link,
    valid_days: String(v.valid_days),
    logo: "",
    shipment: (v.shipment ?? []).map(([k, val]) => `${k}: ${val}`).join("\n"),
  };
  const fill = (s: string, map: Record<string, string>) => s.replace(TOKEN, (m, k) => (k in map ? map[k] : m));
  const htmlMap = Object.fromEntries(Object.entries(plain).map(([k, val]) => [k, esc(val)]));
  htmlMap.link = `<a href="${esc(v.link)}" style="color:#0f7370">${esc(v.link)}</a>`;

  htmlMap.logo = v.logo_src ? `<img src="${esc(v.logo_src)}" alt="${esc(v.company)}" height="56" style="height:56px;width:auto;max-width:220px;display:block;border:0">` : "";
  const isLogoOnly = (para: string) => /^\{\{\s*logo\s*\}\}$/.test(para.trim());

  const paragraphs = t.body.replace(/\r\n/g, "\n").trim().split(/\n{2,}/).filter((para) => v.logo_src || !isLogoOnly(para));
  const html = paragraphs
    .map((para) => {
      if (isLogoOnly(para)) return `<p style="margin:12px 0">${htmlMap.logo}</p>`;
      const only = para.trim().match(/^\{\{\s*(\w+)\s*\}\}$/)?.[1];
      if (only === "shipment") {
        return `<table cellpadding="6" style="border-collapse:collapse;width:100%;font-size:13px">${(v.shipment ?? [])
          .map(([k, val]) => `<tr><td style="border-bottom:1px solid #e5e7eb;color:#6b7280;width:38%;vertical-align:top">${esc(k)}</td><td style="border-bottom:1px solid #e5e7eb">${esc(val)}</td></tr>`)
          .join("")}</table>`;
      }
      if (only === "link") {
        return `<p style="margin:24px 0"><a href="${esc(v.link)}" style="${BUTTON}">${esc(label)}</a></p><p style="color:#6b7280;font-size:12px">If the button doesn't work, copy this address into your browser:<br>${esc(v.link)}</p>`;
      }
      return `<p>${fill(esc(para), htmlMap).replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");
  const text = paragraphs.filter((para) => !isLogoOnly(para)).map((para) => (para.trim().match(/^\{\{\s*link\s*\}\}$/) ? `${label}: ${v.link}` : fill(para, plain))).join("\n\n");
  return {
    subject: fill(t.subject, plain).replace(/\s+/g, " ").trim(),
    text,
    html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#1a1f29;max-width:600px">${html}</div>`,
  };
}

/** What's wrong with a template, or null. The link is how the recipient replies, so it must stay. */
export function templateProblem(t: EmailTemplate) {
  if (!t.subject.trim()) return "The subject can't be empty";
  if (!t.body.trim()) return "The message can't be empty";
  if (t.subject.length > 200) return "The subject is too long";
  if (t.body.length > 8000) return "The message is too long";
  if (!/\{\{\s*link\s*\}\}/.test(t.body)) return "Keep {{link}} in the message: it's how the recipient opens the form";
  return null;
}
