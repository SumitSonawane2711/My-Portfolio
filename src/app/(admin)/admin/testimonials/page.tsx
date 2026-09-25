import type { Metadata } from "next";
import { requireAdmin } from "@/shared/libs/authGuard";
import { TestimonialsManager } from "@/features/testimonials/components/TestimonialsManager";
import { getTestimonialsForAdmin } from "@/features/testimonials/queries/testimonialQueries";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  await requireAdmin();
  return <TestimonialsManager items={await getTestimonialsForAdmin()} />;
}
