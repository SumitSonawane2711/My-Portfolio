import { Container } from "@/shared/components/Container";
import { SkeletonBlock } from "@/shared/components/SkeletonBlock";

// Shaped like /blog: heading, intro, then a list of story cards.
export default function BlogLoading() {
  return (
    <main>
      <Container>
        <div role="status" aria-live="polite" className="flex flex-col items-center">
          <span className="sr-only">Loading stories…</span>
          <SkeletonBlock className="h-10 w-44 md:h-12" />
          <SkeletonBlock className="mt-5 h-4 w-full max-w-xl" />
          <SkeletonBlock className="mt-6 h-9 w-44 rounded-none rounded-tl-lg rounded-br-lg" />
          <ul className="mt-10 flex w-full max-w-4xl flex-col gap-3">
            {[0, 1, 2, 3].map((row) => (
              <li
                key={row}
                className="flex gap-5 rounded-[calc(var(--radius)+4px)] border border-card-edge p-5"
              >
                <div className="flex-1">
                  <SkeletonBlock className="h-3 w-28" />
                  <SkeletonBlock className="mt-3 h-4 w-3/4" />
                  <SkeletonBlock className="mt-3 h-3 w-full" />
                  <SkeletonBlock className="mt-2 h-3 w-5/6" />
                </div>
                <SkeletonBlock className="hidden aspect-[4/3] w-40 shrink-0 rounded-lg sm:block" />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </main>
  );
}
