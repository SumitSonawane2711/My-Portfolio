import type { Metadata } from "next";
import { FreelanceWorkPage } from "@/features/freelance/components/site/FreelanceWorkPage";
import { getFreelancePage } from "@/features/freelance/queries/freelanceQueries";
import { getSettings } from "@/features/settings/queries/settingsQueries";

// Static, refreshed hourly and right after any dashboard change (revalidateSite).
export const revalidate = 3600;

const PATH = "/freelance/work";

export async function generateMetadata(): Promise<Metadata> {
  const [page, profile] = await Promise.all([getFreelancePage(), getSettings()]);
  const title = `Work – ${profile.name}`;
  const description = `Projects ${profile.name} has built for clients: ${page.work
    .slice(0, 3)
    .map((item) => item.clientName || item.title)
    .join(", ")}.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: PATH },
    openGraph: { type: "website", url: PATH, siteName: profile.name, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function FreelanceWork() {
  const [page, profile] = await Promise.all([getFreelancePage(), getSettings()]);
  return <FreelanceWorkPage page={page} profile={profile} />;
}
