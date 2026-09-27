// Browser-safe values. Each must be written as a literal
// `process.env.NEXT_PUBLIC_…` so Next.js can inline it at build time.
// Trimmed: values pasted into hosting dashboards often carry stray whitespace.
export const clientEnv = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim(),
  cloudinaryCloudName: (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "").trim(),
  turnstileSiteKey: (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "").trim(),
};
