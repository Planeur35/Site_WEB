import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  pathnames: {
    "/": "/",
    "/club": {
      fr: "/club",
      en: "/the-club",
    },
    "/planeurs": {
      fr: "/planeurs",
      en: "/gliders",
    },
    "/adherer": {
      fr: "/adherer",
      en: "/join",
    },
    "/decouvrir": {
      fr: "/decouvrir",
      en: "/discover",
    },
    "/actualites": {
      fr: "/actualites",
      en: "/news",
    },
    "/actualites/[slug]": {
      fr: "/actualites/[slug]",
      en: "/news/[slug]",
    },
    "/recits": {
      fr: "/recits",
      en: "/flight-stories",
    },
    "/galerie": {
      fr: "/galerie",
      en: "/gallery",
    },
    "/webcam": "/webcam",
    "/liens": {
      fr: "/liens",
      en: "/links",
    },
    "/contact": "/contact",
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
