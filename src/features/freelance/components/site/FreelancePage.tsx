import type { SiteProfile } from "@/features/settings/interfaces/settings";
import type { FreelancePage as FreelancePageData } from "@/features/freelance/interfaces/freelance";
import { BackToTop } from "./BackToTop";
import { ContactAndFooter } from "./ContactAndFooter";
import { ContactDialog } from "./ContactDialog";
import type { ContactChannels } from "./contactActions";
import { FreelanceAbout } from "./FreelanceAbout";
import { FreelanceContact } from "./FreelanceContact";
import { FreelanceFooter } from "./FreelanceFooter";
import { FreelanceHeader, type HeaderLink } from "./FreelanceHeader";
import { FreelanceHero } from "./FreelanceHero";
import { FreelanceProcess } from "./FreelanceProcess";
import { FreelanceServices } from "./FreelanceServices";
import { FreelanceTestimonials } from "./FreelanceTestimonials";
import { FreelanceWork } from "./FreelanceWork";

type FreelancePageProps = { page: FreelancePageData; profile: SiteProfile };

// The client-facing one-pager: hero → work → what I do → testimonials (when
// there are any) → about → process → contact.
export const FreelancePage = ({ page, profile }: FreelancePageProps) => {
  const { copy } = page;
  const channels: ContactChannels = { whatsapp: page.whatsapp, email: profile.contactEmail };

  const links: HeaderLink[] = [
    page.work.length > 0 && { id: "work", label: "Work" },
    page.services.length > 0 && { id: "services", label: "What I do" },
    copy.about && { id: "about", label: "About" },
    { id: "process", label: "Process" },
  ].filter((link): link is HeaderLink => Boolean(link));

  return (
    <>
      <FreelanceHeader
        name={profile.name}
        avatarPublicId={profile.avatarPublicId}
        available={profile.availableForWork}
        links={links}
        whatsapp={page.whatsapp}
      />
      <main>
        <FreelanceHero copy={copy} />
        <FreelanceWork title={copy.workTitle} intro={copy.workIntro} items={page.work} />
        <FreelanceServices
          title={copy.servicesTitle}
          intro={copy.servicesIntro}
          services={page.services}
        />
        <FreelanceTestimonials items={page.testimonials} />
        <FreelanceAbout
          title={copy.aboutTitle}
          text={copy.about}
          name={profile.name}
          imagePublicId={page.portraitPublicId ?? profile.avatarPublicId}
        />
        <FreelanceProcess copy={copy} offers={page.offers} />
        {/* Contact and footer share the painting as one background. */}
        <ContactAndFooter>
          <FreelanceContact
            title={copy.contactTitle}
            intro={copy.contactIntro}
            channels={channels}
          />
          <FreelanceFooter name={profile.name} socials={profile.socials} />
        </ContactAndFooter>
      </main>
      <BackToTop />
      <ContactDialog whatsapp={channels.whatsapp} email={channels.email} />
    </>
  );
};
