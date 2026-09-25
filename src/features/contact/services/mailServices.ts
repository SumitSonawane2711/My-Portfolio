import nodemailer from "nodemailer";
import { getServerEnv } from "@/shared/configs/env";
import type { ContactPayload } from "../interfaces/contact";

// Server-only — used by app/api/contact/route.ts. Never import this from a
// Client Component (it pulls in nodemailer and server env vars).

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns an error message for the client, or null when the payload is valid.
export const validateContactPayload = ({ name, email, message }: ContactPayload) => {
  if (!name || !email || !message) {
    return "Please fill all the fields";
  }

  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  return null;
};

export const sendContactEmail = async ({ name, email, message }: ContactPayload) => {
  const env = getServerEnv();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.GMAIL_USER,
      pass: env.GMAIL_APP_PASSWORD,
    },
  });

  // Fails fast with a clear error if the SMTP credentials are wrong,
  // instead of silently failing on sendMail.
  await transporter.verify();

  await transporter.sendMail({
    from: `"${name}" <${env.GMAIL_USER}>`,
    replyTo: email,
    to: env.CONTACT_RECEIVER_EMAIL || env.GMAIL_USER,
    subject: `New portfolio message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
            <div style="font-family: sans-serif; font-size: 14px; color: #111;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
            </div>
        `,
  });
};
