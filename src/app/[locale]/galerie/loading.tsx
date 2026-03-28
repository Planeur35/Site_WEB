import SectionContainer from "@/components/ui/SectionContainer";

export default function GalleryLoading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="relative min-h-[60vh] flex items-center justify-center bg-primary/80 animate-pulse">
        <div className="text-center px-4 py-20 max-w-4xl mx-auto space-y-4">
          <div className="h-12 w-48 bg-white/20 rounded-lg mx-auto" />
          <div className="h-6 w-96 bg-white/10 rounded-lg mx-auto max-w-full" />
        </div>
      </div>

      {/* Gallery grid skeleton */}
      <section className="py-16">
        <SectionContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
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
