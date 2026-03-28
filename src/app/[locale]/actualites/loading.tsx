import SectionContainer from "@/components/ui/SectionContainer";

export default function NewsLoading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="relative min-h-[60vh] flex items-center justify-center bg-primary/80 animate-pulse">
        <div className="text-center px-4 py-20 max-w-4xl mx-auto space-y-4">
          <div className="h-12 w-64 bg-white/20 rounded-lg mx-auto" />
          <div className="h-6 w-80 bg-white/10 rounded-lg mx-auto max-w-full" />
        </div>
      </div>

      {/* News grid skeleton */}
      <section className="py-16">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden bg-white border border-gray-100"
              >
                {/* Image placeholder */}
                <div className="aspect-video bg-gray-200 animate-pulse" />

                {/* Content placeholder */}
                <div className="p-5 space-y-3">
                  {/* Category and date */}
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                  </div>

                  {/* Title */}
                  <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />

                  {/* Excerpt lines */}
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-4/5 bg-gray-100 rounded animate-pulse" />
                  </div>

                  {/* Read more */}
                  <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>
    </div>
  );
}
