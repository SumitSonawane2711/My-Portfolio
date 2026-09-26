import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { likeRepository } from "@/features/likes/repositories/likeRepository";
import { rateLimit } from "@/shared/libs/rateLimit";
import { getClientIp, hashValue } from "@/shared/libs/request";

// The only live requests on an (otherwise static) article page.
// Visitors are identified by a random httpOnly cookie, stored only hashed.

type Context = { params: Promise<{ slug: string }> };

const VISITOR_COOKIE = "vid";
const ONE_YEAR = 60 * 60 * 24 * 365;

async function visitorHash(createIfMissing: boolean) {
  const jar = await cookies();
  let vid = jar.get(VISITOR_COOKIE)?.value;
  if (!vid && createIfMissing) {
    vid = randomUUID();
    jar.set(VISITOR_COOKIE, vid, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_YEAR,
      path: "/",
    });
  }
  return vid ? hashValue(vid) : null;
}

const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(_request: Request, { params }: Context) {
  const { slug } = await params;
  const postId = await likeRepository.findVisiblePostId(slug);
  if (!postId) return json({ error: "Not found" }, 404);

  const hash = await visitorHash(false);
  const [count, liked] = await Promise.all([
    likeRepository.count(postId),
    hash ? likeRepository.exists(postId, hash) : false,
  ]);
  return json({ count, liked });
}

export async function POST(_request: Request, { params }: Context) {
  const { slug } = await params;
  const postId = await likeRepository.findVisiblePostId(slug);
  if (!postId) return json({ error: "Not found" }, 404);

  const limit = await rateLimit(`like:${hashValue(await getClientIp())}`, 30, 60);
  if (!limit.ok) return json({ error: "Too many requests" }, 429);

  const hash = (await visitorHash(true))!;
  const liked = await likeRepository.toggle(postId, hash);
  return json({ count: await likeRepository.count(postId), liked });
}
