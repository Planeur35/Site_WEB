import SectionContainer from "@/components/ui/SectionContainer";

export default function Loading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="relative min-h-[60vh] flex items-center justify-center bg-primary/80 animate-pulse">
        <div className="text-center px-4 py-20 max-w-4xl mx-auto space-y-4">
          <div className="h-12 w-80 bg-white/20 rounded-lg mx-auto" />
          <div className="h-6 w-96 bg-white/10 rounded-lg mx-auto max-w-full" />
        </div>
      </div>

      {/* Content skeleton */}
      <section className="py-16">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden bg-white border border-gray-100"
              >
                <div className="aspect-video bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* Second section skeleton */}
      <section className="py-16 bg-light-bg">
        <SectionContainer>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-video bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </SectionContainer>
      </section>
    </div>
  );
}
