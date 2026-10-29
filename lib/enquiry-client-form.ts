import { randomBytes } from "node:crypto";
import { queueEmail } from "@/lib/email-queue";
import { renderEmail, type EmailTemplate } from "@/lib/email-templates";
import { publicBaseUrl } from "@/lib/public-url";

/**
 * "Send to client": a fillable enquiry form the client opens from an emailed link (/enquiry-form/<token>),
 * fills in and signs. The link works until the form is submitted or this many days pass.
 */
export const CLIENT_FORM_VALID_DAYS = 30;

/** Unguessable, URL-safe link token. */
export const newClientFormToken = () => randomBytes(24).toString("base64url");

export const clientFormPath = (token: string) => `/enquiry-form/${token}`;

/** Absolute link for emails, on the public address (see publicBaseUrl). */
export const clientFormUrl = (token: string, request: Request) => new URL(clientFormPath(token), publicBaseUrl(request)).toString();

export const clientFormExpired = (sentAt: Date | null) => !sentAt || Date.now() - sentAt.getTime() > CLIENT_FORM_VALID_DAYS * 86_400_000;

/** Queues the form link email, worded by the company's template; returns the email job id. */
export function sendClientFormEmail(m: { to: string; template: EmailTemplate; logoPath: string | null; contactName: string; companyName: string; senderName: string; ref: string; url: string }) {
  const mail = renderEmail("client_enquiry_form", m.template, { logo_src: m.logoPath ? "cid:logo" : null, contact_name: m.contactName, company: m.companyName, ref: m.ref, sender: m.senderName, link: m.url, valid_days: CLIENT_FORM_VALID_DAYS });
  return queueEmail({ kind: "client_enquiry_form", to: m.to, ...mail, logoPath: m.logoPath });
}
