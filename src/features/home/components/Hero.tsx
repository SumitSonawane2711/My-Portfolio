import Link from "next/link";
import { Heading } from "@/shared/components/Heading";
import { SubHeading } from "@/shared/components/SubHeading";
import { SocialIcon, SOCIAL_LABELS, socialHref } from "@/shared/components/SocialIcon";
import { getSettings } from "@/features/settings/queries/settingsQueries";

export const Hero = async () => {
  const settings = await getSettings();

  return (
    <section className="pt-10">
      <Heading>{settings.heroHeading}</Heading>
      <SubHeading>{settings.heroSubheading}</SubHeading>
      <div className="mt-4 flex items-center gap-4">
        {settings.socials.map((link) => (
          <Link key={link.url} href={socialHref(link)} aria-label={SOCIAL_LABELS[link.platform]}>
            <SocialIcon
              platform={link.platform}
              className="size-5 text-secondary hover:text-primary"
            />
          </Link>
        ))}
        {/* <DownloadResume /> */}
      </div>
    </section>
  );
};
