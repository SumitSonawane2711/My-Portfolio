import { Container } from "@/shared/components/Container";

const Block = ({ className }: { className: string }) => (
  <div
    className={`animate-pulse rounded-lg bg-neutral-200/80 motion-reduce:animate-none dark:bg-neutral-800 ${className}`}
  />
);

// Shown inside the site layout (navbar and footer stay) while a page loads.
export default function SiteLoading() {
  return (
    <main className="flex min-h-screen items-start justify-start">
      <Container className="min-h-screen pt-28 pb-16">
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading…</span>
          <Block className="h-10 w-56 md:h-12" />
          <Block className="mt-5 h-4 w-full max-w-xl" />
          <Block className="mt-2 h-4 w-4/5 max-w-lg" />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((card) => (
              <div
                key={card}
                className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800"
              >
                <Block className="aspect-[16/10] rounded-none" />
                <div className="p-4">
                  <Block className="h-3 w-20" />
                  <Block className="mt-3 h-4 w-11/12" />
                  <Block className="mt-2 h-4 w-3/4" />
                  <Block className="mt-5 h-7 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
