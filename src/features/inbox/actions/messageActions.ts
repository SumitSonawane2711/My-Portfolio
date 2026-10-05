"use server";

import { z } from "zod";
import { requireAdmin } from "@/shared/libs/authGuard";
import { fail, ok, validationFail, type ActionResult } from "@/shared/libs/actionResult";
import { toErrorMessage } from "@/shared/libs/errors";
import { getClientIp } from "@/shared/libs/request";
import { revalidateSite } from "@/shared/libs/revalidate";
import { contactSchema, type ContactInput } from "../schemas/messageSchema";
import { messageRepository } from "../repositories/messageRepository";
import { messageServices } from "../services/messageServices";

// ── Public (no auth; protected by honeypot + Turnstile + rate limit) ─────

export async function sendContactMessage(input: ContactInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return validationFail(parsed.error);
  try {
    await messageServices.submitContact(parsed.data, await getClientIp());
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

// ── Admin ────────────────────────────────────────────────────────────────

const statusSchema = z.enum(["UNREAD", "READ", "ARCHIVED"]);

export async function markMessage(id: string, status: string): Promise<ActionResult> {
  await requireAdmin();
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return validationFail(parsed.error);
  try {
    await messageRepository.setStatus(id, parsed.data);
    revalidateSite.admin(); // unread badge in the sidebar
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await messageRepository.delete(id);
    revalidateSite.admin();
    return ok();
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}
