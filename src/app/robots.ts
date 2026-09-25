import type { MetadataRoute } from "next";
import { clientEnv } from "@/shared/configs/clientEnv";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/login", "/api"] },
    sitemap: `${clientEnv.siteUrl}/sitemap.xml`,
  };
}
