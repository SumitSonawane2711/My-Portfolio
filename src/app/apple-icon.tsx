import { ImageResponse } from "next/og";

// Home-screen icon (iOS rounds the corners itself). Generated once at build time.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#171717",
          color: "#fafafa",
          fontSize: 124,
          // The built-in font has no bold weight; a stroke thickens the letter.
          WebkitTextStroke: "7px #fafafa",
          fontFamily: "sans-serif",
        }}
      >
        S
      </div>
    ),
    size,
  );
}
