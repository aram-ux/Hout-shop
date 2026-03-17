import Container from "@/components/ui/Container";

export default function Loading() {
  return (
    <section className="py-12 lg:py-16">
      <Container>
        {/* Hero skeleton */}
        <div className="mb-12 animate-pulse">
          <div className="h-8 w-2/3 bg-oak-200 rounded-lg mb-4" />
          <div className="h-5 w-1/2 bg-oak-100 rounded-lg" />
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-oak-200 overflow-hidden"
            >
              <div className="aspect-[4/3] bg-oak-200" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-20 bg-oak-100 rounded" />
                <div className="h-5 w-3/4 bg-oak-200 rounded" />
                <div className="h-4 w-full bg-oak-100 rounded" />
                <div className="h-4 w-1/3 bg-oak-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
