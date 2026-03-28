import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  pathnames: {
    "/": "/",
    "/decouvrir": {
      fr: "/decouvrir",
      en: "/discover",
    },
    "/decouvrir/vols-decouverte": {
      fr: "/decouvrir/vols-decouverte",
      en: "/discover/discovery-flights",
    },
    "/decouvrir/devenir-pilote": {
      fr: "/decouvrir/devenir-pilote",
      en: "/discover/become-a-pilot",
    },
    "/le-club": {
      fr: "/le-club",
      en: "/the-club",
    },
    "/le-club/flotte": {
      fr: "/le-club/flotte",
      en: "/the-club/fleet",
    },
    "/le-club/aerodrome": {
      fr: "/le-club/aerodrome",
      en: "/the-club/aerodrome",
    },
    "/le-club/tarifs": {
      fr: "/le-club/tarifs",
      en: "/the-club/pricing",
    },
    "/galerie": {
      fr: "/galerie",
      en: "/gallery",
    },
    "/actualites": {
      fr: "/actualites",
      en: "/news",
    },
    "/actualites/[slug]": {
      fr: "/actualites/[slug]",
      en: "/news/[slug]",
    },
    "/en-direct": {
      fr: "/en-direct",
      en: "/live",
    },
    "/en-direct/webcam": {
      fr: "/en-direct/webcam",
      en: "/live/webcam",
    },
    "/en-direct/weglide": {
      fr: "/en-direct/weglide",
      en: "/live/weglide",
    },
    "/contact": "/contact",
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
