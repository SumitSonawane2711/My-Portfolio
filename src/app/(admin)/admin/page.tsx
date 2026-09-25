import type { Metadata } from "next";
import { requireAdmin } from "@/shared/libs/authGuard";
import { DashboardOverview } from "@/features/admin/components/DashboardOverview";
import { getDashboardStats } from "@/features/admin/repositories/dashboardRepository";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  await requireAdmin();
  const stats = await getDashboardStats();
  return <DashboardOverview stats={stats} />;
}
