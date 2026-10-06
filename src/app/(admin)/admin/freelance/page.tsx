import type { Metadata } from "next";
import { requireAdmin } from "@/shared/libs/authGuard";
import { FreelanceAdmin } from "@/features/freelance/components/admin/FreelanceAdmin";
import {
  getFreelanceOffersForAdmin,
  getFreelanceServicesForAdmin,
  getFreelanceSettingsForEdit,
} from "@/features/freelance/queries/freelanceQueries";

export const metadata: Metadata = { title: "Freelance page" };

export default async function AdminFreelancePage() {
  await requireAdmin();
  const [settings, services, offers] = await Promise.all([
    getFreelanceSettingsForEdit(),
    getFreelanceServicesForAdmin(),
    getFreelanceOffersForAdmin(),
  ]);
  return <FreelanceAdmin settings={settings} services={services} offers={offers} />;
}
