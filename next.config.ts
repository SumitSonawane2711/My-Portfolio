import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed once the MDX content has moved to the database (guide Part 16).
  transpilePackages: ["next-mdx-remote"],

  devIndicators: false,

  images: {
    // A small fixed set of widths → a predictable number of Cloudinary variants.
    deviceSizes: [640, 960, 1280, 1920],
    imageSizes: [64, 128, 256, 384],
  },

  experimental: {
    // Two root layouts ((site) and (admin)) → unmatched URLs need a global 404.
    globalNotFound: true,
    // Long posts send their editor HTML through a server action.
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
