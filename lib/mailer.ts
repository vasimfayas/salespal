import nodemailer, { type Transporter } from "nodemailer";

/**
 * Outgoing email over SMTP, configured from the environment:
 *   SMTP_HOST, SMTP_PORT (default 587), SMTP_USER, SMTP_PASS, MAIL_FROM ("SalesPal <no-reply@…>"),
 *   SMTP_SECURE=true only for implicit-TLS servers (usually port 465); otherwise STARTTLS is used when offered.
 * Without SMTP_HOST email is off and callers fall back to sharing links by hand.
 */
export const mailConfigured = () => !!process.env.SMTP_HOST;

let transport: Transporter | null = null;

export async function sendMail(message: { to: string; subject: string; text: string; html: string; replyTo?: string }) {
  if (!mailConfigured()) return false;
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  await transport.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, ...message });
  return true;
}

/** Escapes text for HTML email bodies. */
export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
