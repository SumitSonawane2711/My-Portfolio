import { HomePage } from "@/features/home/components/HomePage";

// Static, refreshed hourly and immediately after admin saves (revalidatePath).
export const revalidate = 3600;

export default function Home() {
  return <HomePage />;
}
