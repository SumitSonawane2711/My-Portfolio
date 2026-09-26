import { ImageResponse } from "next/og";
import { getPost } from "@/features/blog/queries/blogQueries";
import { getSettings } from "@/features/settings/queries/settingsQueries";

// Per-post social card. Used when the post has no cover image (posts with a
// cover set openGraph.images to it in generateMetadata instead).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Blog post";
export const revalidate = 3600;

export default async function PostOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSettings()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#171717",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#a3a3a3" }}>{settings.name} · Blog</div>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.1 }}>
          {post?.title ?? "Blog"}
        </div>
        <div style={{ fontSize: 28, color: "#a3a3a3" }}>
          {post ? `${post.readingMinutes} min read` : ""}
        </div>
      </div>
    ),
    size,
  );
}
