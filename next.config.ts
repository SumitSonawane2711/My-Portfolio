import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

  async redirects() {
    return [
      // The resume used to be a static file; old links now get the current
      // primary resume (and are counted).
      { source: "/CV_Sumit_Sonawane_2026.pdf", destination: "/resume/download", permanent: true },
      // Blog slugs now come from cleaned-up file names.
      {
        source: "/blog/Adopting-AI-Agents.",
        destination: "/blog/adopting-ai-agents",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
