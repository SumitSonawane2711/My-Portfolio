import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],

  /* config options here */
  devIndicators: false,
};

export default nextConfig;
