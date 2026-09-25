import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { getServerEnv } from "@/shared/configs/env";
import { escapeHtml } from "./content/entities";

let transporter: Transporter | undefined;

const getTransporter = () => {
  if (!transporter) {
    const env = getServerEnv();
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD },
    });
  }
  return transporter;
};

type Notification = {
  subject: string;
  /** Label → value rows. Every value is HTML-escaped (visitor input). */
  fields: [label: string, value: string | null | undefined][];
  replyTo?: string | null;
};

/**
 * Sends a notification to the site owner (CONTACT_RECEIVER_EMAIL or GMAIL_USER).
 * All visitor-supplied values are escaped before going into the HTML body.
 */
export async function notifyOwner({ subject, fields, replyTo }: Notification) {
  const env = getServerEnv();
  const rows = fields.filter(([, value]) => value);

  await getTransporter().sendMail({
    from: `"Portfolio" <${env.GMAIL_USER}>`,
    to: env.CONTACT_RECEIVER_EMAIL || env.GMAIL_USER,
    replyTo: replyTo || undefined,
    subject: subject.replace(/[\r\n]+/g, " ").slice(0, 200),
    text: rows.map(([label, value]) => `${label}:\n${value}`).join("\n\n"),
    html: `<div style="font-family: sans-serif; font-size: 14px; color: #111;">${rows
      .map(
        ([label, value]) =>
          `<p><strong>${escapeHtml(label)}:</strong></p><p style="white-space: pre-wrap;">${escapeHtml(value!)}</p>`,
      )
      .join("")}</div>`,
  });
}
