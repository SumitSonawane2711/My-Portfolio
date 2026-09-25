import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed once the MDX content has moved to the database (guide Part 16).
  transpilePackages: ["next-mdx-remote"],

  devIndicators: false,

  experimental: {
    // Two root layouts ((site) and (admin)) → unmatched URLs need a global 404.
    globalNotFound: true,
  },
};

export default nextConfig;
