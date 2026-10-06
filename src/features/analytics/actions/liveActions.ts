"use server";

import { requireAdmin } from "@/shared/libs/authGuard";
import { fail, ok, type ActionResult } from "@/shared/libs/actionResult";
import { toErrorMessage } from "@/shared/libs/errors";
import { liveVisitorRepository } from "../repositories/liveVisitorRepository";

export type LiveCounts = { portfolio: number; freelance: number };

export async function getLiveVisitors(): Promise<ActionResult<LiveCounts>> {
  await requireAdmin();
  try {
    return ok(await liveVisitorRepository.countLive());
  } catch (error) {
    return fail(toErrorMessage(error));
  }
}
