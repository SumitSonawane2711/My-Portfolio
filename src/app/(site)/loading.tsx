import { Container } from "@/shared/components/Container";
import { SkeletonBlock } from "@/shared/components/SkeletonBlock";

// Shown inside the site layout (navbar and footer stay) while a page loads.
// Shaped like the home page: heading, intro, actions, then a row of cards.
export default function SiteLoading() {
  return (
    <main>
      <Container>
        <div role="status" aria-live="polite" className="flex flex-col items-center">
          <span className="sr-only">Loading…</span>
          <SkeletonBlock className="mt-10 h-12 w-72 md:h-16 md:w-[28rem]" />
          <SkeletonBlock className="mt-5 h-4 w-full max-w-xl" />
          <SkeletonBlock className="mt-2 h-4 w-4/5 max-w-lg" />
          <div className="mt-7 flex gap-3">
            <SkeletonBlock className="h-10 w-36 rounded-none rounded-tr-lg rounded-bl-lg" />
            <SkeletonBlock className="h-10 w-28 rounded-none rounded-tl-lg rounded-br-lg" />
          </div>
          <div className="mt-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((card) => (
              <div
                key={card}
                className="overflow-hidden rounded-[calc(var(--radius)+4px)] border border-card-edge"
              >
                <SkeletonBlock className="aspect-video rounded-none" />
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
