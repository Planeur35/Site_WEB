import Container from "@/components/ui/Container";
import FlightTrace from "@/components/ui/FlightTrace";

/** While a page loads: the empty-state frame, with the trace and no text. */
export default function Loading() {
  return (
    <Container className="py-16 lg:py-28">
      <div aria-busy="true" className="relative h-60 overflow-hidden rounded-md lg:h-[300px]">
        <FlightTrace seed="chargement" align="right" className="absolute! inset-0 animate-pulse" />
      </div>
    </Container>
  );
}
