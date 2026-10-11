# AGENTS.md

Instructions for AI coding assistants (Claude Code, GitHub Copilot, Codex…) working on this repository.

## Project

New website for the Planeurs d'Ille-et-Vilaine (PIV) glider club, replacing the Joomla site at planeur35.org.
Bilingual: French by default (`/fr`), English (`/en`). Main goal: attract new members.
Content is edited by non-technical volunteers in Sanity Studio, so prefer making content editable in Sanity over hardcoding it.

Read these when a task touches their topic, instead of guessing:

- `docs/MANUEL-TECHNIQUE.md`: architecture, where each page's content lives, update recipes, known issues
- `docs/GUIDE-CONTRIBUTEUR.md`: contributor workflow (Studio, Git, pull requests), written for beginners

## Stack

- Next.js 15 App Router, React 19, TypeScript (`strict`), path alias `@/*` → `src/*`
- Tailwind CSS 4; design tokens in `src/app/globals.css` (`@theme`)
- next-intl 4 for routing and UI strings
- Sanity v4, Studio embedded at `/studio`, project `8mup540n`, single dataset `production`
- Hosted on Vercel: every push to `main` deploys to production; every branch gets a preview URL
- Resend for the contact form, Leaflet + OpenStreetMap for the map

## Commands

```bash
npm run dev     # http://localhost:3000/fr, Studio at /studio
npm run lint    # ESLint (next/core-web-vitals + next/typescript)
npm run build   # production build, the same one Vercel runs
```

There is no test suite. A change is verified when `npm run lint` and `npm run build` pass and the affected pages look right in `npm run dev` at `/fr` and `/en`, on desktop and at ~375 px wide.

Do not run anything in `scripts/` unless explicitly asked: they write to the production Sanity dataset and need `SANITY_WRITE_TOKEN`.

## Where things are

```text
src/app/[locale]/          one folder per page (French paths: le-club/tarifs, decouvrir/vols-decouverte…)
src/app/[locale]/contact/actions.ts   server action that sends the contact form through Resend
src/app/studio/            embedded Sanity Studio
src/components/layout/     Header (desktop + mobile nav arrays), MobileMenu, Footer, LanguageToggle
src/components/ui/         Hero, Card, Button, SectionContainer, Gallery, Lightbox, Map, ContactForm
src/lib/sanity/            client, queries (all GROQ), types, image (urlFor), localize
src/lib/metadata.ts        buildMetadata(): title, Open Graph, canonical, hreflang
src/i18n/                  routing.ts (translated pathnames), navigation.ts, request.ts
src/messages/fr.json, en.json   UI strings
sanity/schemas/            content model: aircraft, article, category, galleryImage, page, siteSettings
```

## Rules

### Next.js and React

- Components are Server Components by default. Add `'use client'` only for state, effects, event handlers or browser APIs.
- In Next.js 15, `params` is a Promise: `const { locale } = await params;`, then call `setRequestLocale(locale)` in every page and layout.
- Every page exports `generateMetadata` built with `buildMetadata()` from `@/lib/metadata`.
- Leaflet must stay behind `next/dynamic` with `ssr: false` (`Map.tsx` loads `MapInner.tsx`).
- Use `next/image`. Build Sanity image URLs with `urlFor()` from `@/lib/sanity/image`.
- One default-exported function component per file, PascalCase file name, props typed with an `XxxProps` interface. Import with the `@/` alias.

### Styling

- Tailwind utility classes only; no new CSS files. Use `clsx` for conditional classes.
- Use the theme tokens (`bg-primary`, `text-accent`, `bg-cta`, `text-muted`, `border-border`…) instead of raw hex colors.
- Mobile first. Tap targets at least 44 px, visible keyboard focus, `alt` text on every image.

### Internationalisation

- Never hardcode UI text in components. Add the key to both `src/messages/fr.json` and `src/messages/en.json`; the two files must keep exactly the same keys.
- French copy uses proper accents (é, è, à, ç). Some existing strings lack them; fix those you touch.
- Internal links: import `Link`, `redirect`, `useRouter` from `@/i18n/navigation`, never from `next/link`. Link to the French pathname (`/le-club/tarifs`); next-intl translates it.
- A new page also needs: its pathname and English slug in `src/i18n/routing.ts`, entries in the Header nav arrays and in `Footer.tsx`, and a line in `src/app/sitemap.ts`.

### Sanity

- Changing the content model goes in this order: `sanity/schemas/<type>.ts` (`defineType`, `defineField`) → `sanity/schemas/index.ts` → `src/lib/sanity/types.ts` → query in `src/lib/sanity/queries.ts` → page.
- Bilingual fields are objects `{ fr, en }`. Read them with `localize(field, locale)`. It has no fallback: an empty `en` renders empty.
- Wrap every `client.fetch` in `try/catch` with fallback content, so pages still render when Sanity is empty or unreachable.
- Any page that reads Sanity must `export const revalidate = 60`. Without it the page is frozen at build time and Studio edits only appear after the next deploy.
- Never rename or remove an existing schema field without a migration plan: editors' content would disappear from the site. Adding fields is safe.
- The read client uses the CDN without a token, so drafts are never visible on the site.

### Security and data

- Never commit, print or paste secrets. `.env.local` is gitignored. Variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `RESEND_API_KEY`, `CONTACT_EMAIL`; the same ones are set in Vercel.
- No personal data about club members (phone numbers, addresses, licence numbers) in the code.
- Keep contact form validation in the server action, not only in the browser.

### Git

- `main` is production. Never commit directly to `main` and never force-push it.
- Work on a branch named `type/topic`, with type `contenu`, `fix`, `feat` or `docs` (for example `fix/menu-mobile`), then open a pull request.
- `npm run lint` and `npm run build` must pass before opening a pull request.
- Commit messages: English, imperative mood, under 72 characters. Pull request descriptions can be in French.
- Keep pull requests small: one topic per branch.

### Language

- Site copy: French first, always with its English translation.
- Code, identifiers and code comments: English.
- Documentation in `docs/`: French.

## Known issues

Fix these only when the task is about them; otherwise mention them if they are relevant.

- Home, fleet, contact, webcam, WeGlide and the three `decouvrir` pages read Sanity without `revalidate`.
- `Footer.tsx` hardcodes wrong contact details (Rennes Saint-Jacques aerodrome, placeholder phone) instead of reading `siteSettings`.
- The pricing page shows placeholder prices from `fr.json`; real discovery flight prices are 170 € and 130 € (under 18).
- `src/lib/email.ts` sends from `onboarding@resend.dev`, which only delivers to the Resend account owner until planeur35.org is verified in Resend.
- WeGlide club ID: the seed uses 271, the old site links to 1221. Unconfirmed.
- `scripts/seed-fleet.ts` and `scripts/upload-fleet-images.ts` hardcode the project ID.
