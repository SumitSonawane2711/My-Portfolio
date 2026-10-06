import { ImageResponse } from "next/og";
import { getFreelancePage } from "@/features/freelance/queries/freelanceQueries";
import { getSettings } from "@/features/settings/queries/settingsQueries";

// Generated link preview for /freelance. When a preview image is uploaded in
// Admin → Freelance → SEO, page.tsx points og:image at it instead.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Freelance full-stack developer";
export const revalidate = 3600;

export default async function FreelanceOgImage() {
  const [page, profile] = await Promise.all([getFreelancePage(), getSettings()]);

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
          background: "#0a0a0a",
          color: "#fafaf9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 44, color: "#f59e0b", fontWeight: 700 }}>
            {page.copy.greeting || `Hi, I'm ${profile.name.split(" ")[0]},`}
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 60,
              lineHeight: 1.12,
              fontWeight: 700,
              letterSpacing: -1,
              maxWidth: 1000,
            }}
          >
            {page.copy.headline}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
            color: "#a3a3a3",
          }}
        >
          <div style={{ display: "flex" }}>{profile.name} · Freelance full-stack developer</div>
          {profile.availableForWork && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#d4d4d4" }}>
              <div style={{ width: 16, height: 16, borderRadius: 16, background: "#10b981" }} />
              Available
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
