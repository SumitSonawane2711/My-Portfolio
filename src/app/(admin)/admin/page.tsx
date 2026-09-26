import type { Metadata } from "next";
import { requireAdmin } from "@/shared/libs/authGuard";
import { DashboardOverview } from "@/features/admin/components/DashboardOverview";
import { getChartRows, getDashboardStats } from "@/features/admin/repositories/dashboardRepository";
import { buildDashboardCharts, chartsSince } from "@/features/admin/services/dashboardCharts";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  await requireAdmin();
  const now = new Date();
  const [stats, chartRows] = await Promise.all([
    getDashboardStats(),
    getChartRows(chartsSince(now)),
  ]);
  return <DashboardOverview stats={stats} charts={buildDashboardCharts(chartRows, now)} />;
}
