import { HomePage } from "@/features/home/components/HomePage";
import { getSettings } from "@/features/settings/queries/settingsQueries";
import { clientEnv } from "@/shared/configs/clientEnv";
import { cldUrl } from "@/shared/libs/cloudinaryUrl";

// Static, refreshed hourly and immediately after admin saves (revalidatePath).
export const revalidate = 3600;

export default async function Home() {
  const settings = await getSettings();

  // Structured data describing you, so search engines can show a profile.
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.name,
    url: clientEnv.siteUrl,
    description: settings.summary || settings.siteDescription,
    sameAs: settings.socials.filter((s) => s.platform !== "email").map((s) => s.url),
    ...(settings.avatarPublicId && {
      image: settings.avatarPublicId.startsWith("/")
        ? `${clientEnv.siteUrl}${settings.avatarPublicId}`
        : cldUrl(settings.avatarPublicId, { width: 400 }),
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
      />
      <HomePage />
    </>
  );
}
