import "server-only";
import { CACHE_TAGS, cachedQuery } from "@/shared/libs/dataCache";
import { getYearsOfExperience } from "@/features/experience/queries/experienceQueries";
import { fillYears } from "@/features/settings/services/settingsServices";
import type {
  FreelanceOfferAdminRow,
  FreelancePage,
  FreelanceServiceAdminRow,
  FreelanceSettingsFormData,
} from "../interfaces/freelance";
import { freelanceRepository } from "../repositories/freelanceRepository";
import { toWorkItem } from "../services/freelanceServices";

/**
 * Everything /freelance renders, in one cached read. Project, technology and
 * testimonial edits clear it too, since the page shows them.
 */
export const getFreelancePage = cachedQuery(
  "freelance:page",
  [
    CACHE_TAGS.freelance,
    CACHE_TAGS.projects,
    CACHE_TAGS.technologies,
    CACHE_TAGS.testimonials,
    CACHE_TAGS.experience,
  ],
  async (): Promise<FreelancePage> => {
    const [row, services, offers, work, testimonials, years] = await Promise.all([
      freelanceRepository.getSettings(),
      freelanceRepository.listVisibleServices(),
      freelanceRepository.listVisibleOffers(),
      freelanceRepository.listWork(),
      freelanceRepository.listTestimonials(),
      getYearsOfExperience(),
    ]);
    const fill = (text: string) => fillYears(text, years);

    return {
      copy: {
        greeting: row.greeting,
        headline: fill(row.headline),
        intro: fill(row.intro),
        workTitle: row.workTitle,
        workIntro: fill(row.workIntro),
        servicesTitle: row.servicesTitle,
        servicesIntro: fill(row.servicesIntro),
        aboutTitle: row.aboutTitle,
        about: fill(row.about),
        processTitle: row.processTitle,
        processIntro: fill(row.processIntro),
        offersTitle: row.offersTitle,
        contactTitle: row.contactTitle,
        contactIntro: fill(row.contactIntro),
        availabilityNote: row.availabilityNote,
      },
      portraitPublicId: row.portrait?.publicId ?? null,
      ogImagePublicId: row.ogImage?.publicId ?? null,
      seoTitle: row.seoTitle,
      seoDescription: fill(row.seoDescription),
      whatsapp: row.whatsapp,
      services: services.map(({ id, title, summary, details }) => ({
        id,
        title,
        summary,
        details,
      })),
      offers: offers.map(({ id, name, badge, tagline, description, deliverables }) => ({
        id,
        name,
        badge,
        tagline,
        description,
        deliverables,
      })),
      work: work.map(toWorkItem),
      testimonials: testimonials.map((t) => ({
        id: t.id,
        name: t.name,
        byline: [t.role, t.company].filter(Boolean).join(" – ") || null,
        quote: t.quote,
        avatarPublicId: t.avatar?.publicId ?? null,
        linkedinUrl: t.linkedinUrl,
      })),
    };
  },
);

// ── Admin (never cached) ─────────────────────────────────────────────────

export async function getFreelanceSettingsForEdit(): Promise<FreelanceSettingsFormData> {
  const row = await freelanceRepository.getSettings();
  return {
    greeting: row.greeting,
    headline: row.headline,
    intro: row.intro,
    workTitle: row.workTitle,
    workIntro: row.workIntro,
    servicesTitle: row.servicesTitle,
    servicesIntro: row.servicesIntro,
    aboutTitle: row.aboutTitle,
    about: row.about,
    processTitle: row.processTitle,
    processIntro: row.processIntro,
    offersTitle: row.offersTitle,
    contactTitle: row.contactTitle,
    contactIntro: row.contactIntro,
    availabilityNote: row.availabilityNote,
    whatsapp: row.whatsapp ?? "",
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    portrait: row.portrait,
    ogImage: row.ogImage,
  };
}

export async function getFreelanceServicesForAdmin(): Promise<FreelanceServiceAdminRow[]> {
  const rows = await freelanceRepository.listServices();
  return rows.map(({ id, title, summary, details, visible }) => ({
    id,
    title,
    summary,
    details,
    visible,
  }));
}

export async function getFreelanceOffersForAdmin(): Promise<FreelanceOfferAdminRow[]> {
  const rows = await freelanceRepository.listOffers();
  return rows.map(({ id, name, badge, tagline, description, deliverables, visible }) => ({
    id,
    name,
    badge,
    tagline,
    description,
    deliverables,
    visible,
  }));
}
