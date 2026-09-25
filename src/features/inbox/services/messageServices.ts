import "server-only";
import { after } from "next/server";
import { AppError } from "@/shared/libs/errors";
import { notifyOwner } from "@/shared/libs/mailer";
import { rateLimit } from "@/shared/libs/rateLimit";
import { hashValue } from "@/shared/libs/request";
import { verifyTurnstile } from "@/shared/libs/turnstile";
import { messageRepository } from "../repositories/messageRepository";
import type { ContactInput, FeedbackInput } from "../schemas/messageSchema";

const MESSAGES_PER_HOUR = 5;

/**
 * Checks shared by every public form. Returns false for a honeypot hit: the
 * bot gets a normal "sent" response but nothing is stored.
 */
async function passesBotChecks(input: { website?: string; turnstileToken: string }, ip: string) {
  if (input.website) return false;
  if (!(await verifyTurnstile(input.turnstileToken, ip))) {
    throw new AppError("Verification failed. Please try again.");
  }
  const limit = await rateLimit(`message:${hashValue(ip)}`, MESSAGES_PER_HOUR, 60 * 60);
  if (!limit.ok) {
    throw new AppError(
      "You've sent several messages already — please try again later.",
      "RATE_LIMITED",
    );
  }
  return true;
}

// Email the owner after the response is sent; a slow or failing SMTP server
// never affects the visitor (the message is already stored).
const notifyLater = (notification: Parameters<typeof notifyOwner>[0]) =>
  after(() =>
    notifyOwner(notification).catch((error) => console.error("Notification email failed:", error)),
  );

export const messageServices = {
  async submitContact(input: ContactInput, ip: string) {
    if (!(await passesBotChecks(input, ip))) return;
    await messageRepository.create({
      kind: "CONTACT",
      name: input.name,
      email: input.email,
      message: input.message,
    });
    notifyLater({
      subject: `New portfolio message from ${input.name}`,
      replyTo: input.email,
      fields: [
        ["Name", input.name],
        ["Email", input.email],
        ["Message", input.message],
      ],
    });
  },

  async submitFeedback(input: FeedbackInput, ip: string) {
    if (!(await passesBotChecks(input, ip))) return;
    const post = input.postSlug ? await messageRepository.findVisiblePost(input.postSlug) : null;
    await messageRepository.create({
      kind: input.kind,
      postId: post?.id ?? null,
      name: input.name || null,
      email: input.email || null,
      message: input.message,
      quotedText: input.quotedText || null,
    });
    notifyLater({
      subject: `New ${input.kind.toLowerCase()} on "${post?.title ?? "your blog"}"`,
      replyTo: input.email || null,
      fields: [
        ["Post", post?.title],
        ["Quoted text", input.quotedText],
        ["Message", input.message],
        ["From", [input.name, input.email].filter(Boolean).join(" · ")],
      ],
    });
  },
};
