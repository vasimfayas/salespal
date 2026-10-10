import { randomBytes } from "node:crypto";
import { escapeHtml, sendMail } from "@/lib/mailer";

/**
 * "Send to client": a fillable enquiry form the client opens from an emailed link (/enquiry-form/<token>),
 * fills in and signs. The link works until the form is submitted or this many days pass.
 */
export const CLIENT_FORM_VALID_DAYS = 30;

/** Unguessable, URL-safe link token. */
export const newClientFormToken = () => randomBytes(24).toString("base64url");

export const clientFormPath = (token: string) => `/enquiry-form/${token}`;

/** Absolute link for emails: APP_URL when set (the address clients can reach), else the request's own origin. */
export const clientFormUrl = (token: string, requestUrl: string) =>
  new URL(clientFormPath(token), process.env.APP_URL || new URL(requestUrl).origin).toString();

export const clientFormExpired = (sentAt: Date | null) => !sentAt || Date.now() - sentAt.getTime() > CLIENT_FORM_VALID_DAYS * 86_400_000;

/** Emails the link. False when email isn't configured; throws when the SMTP server refuses it. */
export function sendClientFormEmail(m: { to: string; contactName: string; companyName: string; senderName: string; ref: string; url: string }) {
  const hello = m.contactName && m.contactName !== "-" ? `Dear ${m.contactName},` : "Hello,";
  const text = [
    hello,
    "",
    `${m.companyName} has sent you a freight enquiry form (${m.ref}). Fill in your shipment details and sign at the end:`,
    m.url,
    "",
    `The link works for ${CLIENT_FORM_VALID_DAYS} days. We'll send you a quote once we receive it.`,
    "",
    `${m.senderName}`,
    m.companyName,
  ].join("\n");
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#1a1f29;max-width:560px">
      <p>${escapeHtml(hello)}</p>
      <p><strong>${escapeHtml(m.companyName)}</strong> has sent you a freight enquiry form (${escapeHtml(m.ref)}).
         Fill in your shipment details and sign at the end.</p>
      <p style="margin:24px 0">
        <a href="${escapeHtml(m.url)}" style="background:#0f7370;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block;font-weight:bold">
          Fill in the enquiry form
        </a>
      </p>
      <p style="color:#6b7280;font-size:12px">The link works for ${CLIENT_FORM_VALID_DAYS} days. If the button doesn't work, copy this address into your browser:<br>${escapeHtml(m.url)}</p>
      <p>We'll send you a quote once we receive it.</p>
      <p>${escapeHtml(m.senderName)}<br>${escapeHtml(m.companyName)}</p>
    </div>`;
  return sendMail({ to: m.to, subject: `Freight enquiry form ${m.ref} — ${m.companyName}`, text, html });
}
