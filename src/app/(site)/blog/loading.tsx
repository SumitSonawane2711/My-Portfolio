import { Container } from "@/shared/components/Container";
import { SkeletonBlock } from "@/shared/components/SkeletonBlock";

// Shaped like /blog: heading, intro, then a list of story cards.
export default function BlogLoading() {
  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen pt-28 pb-16">
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading stories…</span>
          <SkeletonBlock className="h-10 w-44 md:h-12" />
          <SkeletonBlock className="mt-5 h-4 w-full max-w-xl" />
          <SkeletonBlock className="mt-6 h-9 w-44 rounded-full" />
          <ul className="mt-10 flex flex-col gap-3">
            {[0, 1, 2, 3].map((row) => (
              <li
                key={row}
                className="flex gap-5 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800"
              >
                <div className="flex-1">
                  <SkeletonBlock className="h-3 w-28" />
                  <SkeletonBlock className="mt-3 h-4 w-3/4" />
                  <SkeletonBlock className="mt-3 h-3 w-full" />
                  <SkeletonBlock className="mt-2 h-3 w-5/6" />
                </div>
                <SkeletonBlock className="hidden aspect-[4/3] w-40 shrink-0 rounded-xl sm:block" />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </main>
  );
}
