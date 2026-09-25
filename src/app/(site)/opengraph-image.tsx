import { ImageResponse } from "next/og";
import { getSettings } from "@/features/settings/queries/settingsQueries";

// Default social card for pages without their own image.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Portfolio";
export const revalidate = 3600;

export default async function OpengraphImage() {
  const settings = await getSettings();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#fafafa",
          color: "#262626",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>
          {settings.name || settings.siteTitle}
        </div>
        <div style={{ marginTop: 24, fontSize: 36, color: "#737373", maxWidth: 900 }}>
          {settings.summary || settings.siteDescription}
        </div>
      </div>
    ),
    size,
  );
}
