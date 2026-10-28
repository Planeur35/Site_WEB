import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Pages of the first version of the site, now merged into the new structure
const oldPaths: [string, string][] = [
  ["/fr/le-club", "/fr/club"],
  ["/fr/le-club/flotte", "/fr/planeurs"],
  ["/fr/le-club/aerodrome", "/fr/club#plateforme"],
  ["/fr/le-club/tarifs", "/fr/adherer"],
  ["/fr/decouvrir/vols-decouverte", "/fr/decouvrir"],
  ["/fr/decouvrir/devenir-pilote", "/fr/club#formation"],
  ["/fr/en-direct", "/fr/webcam"],
  ["/fr/en-direct/webcam", "/fr/webcam"],
  ["/fr/en-direct/weglide", "/fr/recits"],
  ["/en/the-club/fleet", "/en/gliders"],
  ["/en/the-club/aerodrome", "/en/the-club#plateforme"],
  ["/en/the-club/pricing", "/en/join"],
  ["/en/discover/discovery-flights", "/en/discover"],
  ["/en/discover/become-a-pilot", "/en/the-club#formation"],
  ["/en/live", "/en/webcam"],
  ["/en/live/webcam", "/en/webcam"],
  ["/en/live/weglide", "/en/flight-stories"],
];

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/sanity/imageLoader.ts",
  },
  async redirects() {
    return oldPaths.map(([source, destination]) => ({
      source,
      destination,
      permanent: false,
    }));
  },
};

export default withNextIntl(nextConfig);
