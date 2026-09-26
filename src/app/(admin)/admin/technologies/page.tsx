import type { Metadata } from "next";
import { requireAdmin } from "@/shared/libs/authGuard";
import { TechnologiesManager } from "@/features/technologies/components/TechnologiesManager";
import { getTechnologiesForAdmin } from "@/features/technologies/queries/technologyQueries";

export const metadata: Metadata = { title: "Technologies" };

export default async function TechnologiesPage() {
  await requireAdmin();
  const technologies = await getTechnologiesForAdmin();
  return <TechnologiesManager technologies={technologies} />;
}
