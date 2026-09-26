// Pure publish rules for blog posts (no database, no Next.js) — unit tested.
//
//   DRAFT      never visible
//   PUBLISHED  visible; publishedAt defaults to now (or keeps its earlier value)
//   SCHEDULED  publishedAt must be in the future; becomes visible when it passes
//
// A post is visible when status ∈ {PUBLISHED, SCHEDULED} AND publishedAt ≤ now,
// so scheduled posts appear without a cron job (list pages revalidate hourly).

export type PostStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED";

export class PublishRuleError extends Error {}

export function resolvePublishState(
  requested: { status: PostStatus; publishedAt: Date | null },
  previousPublishedAt: Date | null,
  now: Date = new Date(),
): { status: PostStatus; publishedAt: Date | null } {
  const { status, publishedAt } = requested;

  if (status === "DRAFT") {
    return { status, publishedAt: publishedAt ?? previousPublishedAt };
  }

  if (status === "SCHEDULED") {
    if (!publishedAt) throw new PublishRuleError("Pick a date and time to schedule the post.");
    if (publishedAt <= now) throw new PublishRuleError("A scheduled date must be in the future.");
    return { status, publishedAt };
  }

  // PUBLISHED: a future date means it's really a scheduled post.
  const date = publishedAt ?? previousPublishedAt ?? now;
  return { status: date > now ? "SCHEDULED" : "PUBLISHED", publishedAt: date };
}

export const isVisible = (
  post: { status: PostStatus; publishedAt: Date | null },
  now: Date = new Date(),
) => post.status !== "DRAFT" && post.publishedAt !== null && post.publishedAt <= now;

/** First ~160 characters of the text, cut at a word boundary. */
export function excerptFrom(plainText: string, max = 160) {
  const text = plainText.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : max).trim()}…`;
}
