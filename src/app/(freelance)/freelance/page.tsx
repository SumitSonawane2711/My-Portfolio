import type { Metadata } from "next";
import { clientEnv } from "@/shared/configs/clientEnv";
import { cldUrl } from "@/shared/libs/cloudinaryUrl";
import { toPlainText } from "@/shared/libs/richText";
import { FreelancePage } from "@/features/freelance/components/site/FreelancePage";
import { getFreelancePage } from "@/features/freelance/queries/freelanceQueries";
import { getSettings } from "@/features/settings/queries/settingsQueries";

// Static, refreshed hourly and right after any dashboard change (revalidateSite).
export const revalidate = 3600;

const PATH = "/freelance";

export async function generateMetadata(): Promise<Metadata> {
  const [page, profile] = await Promise.all([getFreelancePage(), getSettings()]);
  const title = page.seoTitle || `${profile.name} – Freelance Full-Stack Developer`;
  const description = page.seoDescription || toPlainText(page.copy.headline);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: PATH },
    openGraph: {
      type: "website",
      url: PATH,
      siteName: profile.name,
      title,
      description,
      locale: "en_US",
      // An uploaded image wins; otherwise opengraph-image.tsx generates one.
      ...(page.ogImagePublicId && {
        images: [
          {
            url: cldUrl(page.ogImagePublicId, {
              width: 1200,
              height: 630,
              crop: "fill",
              format: "jpg",
            }),
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Freelance() {
  const [page, profile] = await Promise.all([getFreelancePage(), getSettings()]);
  const url = `${clientEnv.siteUrl}${PATH}`;

  // Structured data: a professional service offered by a person.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: page.seoTitle || `${profile.name} – Freelance Full-Stack Developer`,
    description: page.seoDescription || toPlainText(page.copy.headline),
    url,
    ...(profile.phone && { telephone: profile.phone }),
    ...(profile.contactEmail && { email: profile.contactEmail }),
    ...(profile.location && { address: profile.location }),
    areaServed: "Worldwide",
    founder: {
      "@type": "Person",
      name: profile.name,
      url: clientEnv.siteUrl,
      sameAs: profile.socials.filter((s) => s.platform !== "email").map((s) => s.url),
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: page.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.summary,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <FreelancePage page={page} profile={profile} />
    </>
  );
}
