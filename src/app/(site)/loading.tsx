import { Container } from "@/shared/components/Container";
import { SkeletonBlock } from "@/shared/components/SkeletonBlock";

// Shown inside the site layout (navbar and footer stay) while a page loads.
// Shaped like the home page: heading, intro, actions, then a row of cards.
export default function SiteLoading() {
  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen pt-28 pb-16">
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading…</span>
          <SkeletonBlock className="h-10 w-64 md:h-12" />
          <SkeletonBlock className="mt-5 h-4 w-full max-w-xl" />
          <SkeletonBlock className="mt-2 h-4 w-4/5 max-w-lg" />
          <div className="mt-7 flex gap-3">
            <SkeletonBlock className="h-10 w-36 rounded-full" />
            <SkeletonBlock className="h-10 w-28 rounded-full" />
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((card) => (
              <div
                key={card}
                className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800"
              >
                <SkeletonBlock className="aspect-[16/10] rounded-none" />
                <div className="p-4">
                  <SkeletonBlock className="h-3 w-20" />
                  <SkeletonBlock className="mt-3 h-4 w-11/12" />
                  <SkeletonBlock className="mt-2 h-4 w-3/4" />
                  <SkeletonBlock className="mt-5 h-7 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
