# Design handoff — planeur35.org redesign

Brief for Claude Design. Goal: a modern, airy redesign of the PIV glider club website. The current version works but looks dated.

## The club and the site

- **Who**: Planeurs d'Ille-et-Vilaine (PIV), a volunteer-run gliding club in Brittany, France. Its airfield is near the coast and Rennes.
- **Main goal**: attract new members and sell trial flights ("vols d'initiation", 170 € adult / 130 € under 18). After those, inform current members (news, agenda, webcam, useful links).
- **Audience**: curious locals aged 15 to 70, parents booking a gift flight, companies buying flight vouchers, and existing pilots on their phones at the airfield.
- **Languages**: French first (`/fr`), English (`/en`). Every UI string exists in both, and layouts must take ~20 % longer French text.
- **Content**: every page is filled by non-technical volunteers in Sanity Studio. Designs must still look good with **no photo**, short text or an empty list. They must also look good with a 3,000-word article.

## Brief from the club's spec

- "Modern and dynamic look". A mix of a one-page layout and a top menu: a main menu bar, plus a full "hamburger" menu.
- **Visuals first**: large-format photos.
- **Bright, airy mood**: white and sky blue dominate, contrasting with landscape photos and white clouds.
- **Home**: a striking glider-in-flight photo, possibly over the coast, or 3–4 rotating photos.
- **Inspiration named by the club**: apple.com, linear.app, supima.com, the Luchon gliding club site.
- Uses the PIV logo (`public/logo.png`, `public/logo-icon.png`).

## Why the current design feels dated

1. Titles use the browser's default serif (Georgia/Times).
2. The hero has its title over a busy photo, with weak contrast and no call to action.
3. Pages without a photo fall back to clip-art ellipse clouds and an SVG glider silhouette.
4. Everything is tiny grey uppercase labels, 1 px dividers and boxed cards. Contrast is low, hierarchy is flat and there is no motion.
5. The logo renders small and blurry in the header.

What to keep: the sky palette direction, square-ish restraint (no bubbly UI), generous whitespace, and photo-led pages.

## Current tokens (to evolve, not keep as-is)

| Token | Value | Use |
|---|---|---|
| `ciel` | `#f4f7fa` | page background |
| `horizon` | `#eaf1f7` | alternate band |
| `nuit` | `#0e1c2b` | footer, dark text |
| `azur` | `#12304f` | headings |
| `altitude` | `#3a7ca5` | accents |

Tailwind 4 with `sky-*` and `slate-*` alongside them. The focus ring is `#0369a1`.

## Pages to design

| Route (fr) | Content |
|---|---|
| `/` Accueil | hero slideshow (3–4 photos, title + subtitle each); key figures (members, flight hours, gliders, founding year); 3 entry cards (Venez essayer / Apprendre à voler / S'inscrire); latest 3 news |
| `/club` | long one-page with anchors: Présentation, La plateforme, Activité des membres, Formation initiale (with a training-path diagram), École de campagne, Compétition, Histoire du club (magazine-style long read with anecdote call-outs and inline photos) |
| `/planeurs` | fleet list: photo, name, single/two-seater, role, year, description, specs table |
| `/adherer` | pricing tables (20 h package and unlimited package × under/over 25; training packs) + "how to join" text |
| `/decouvrir` | trial flight: description, price, "Réserver et payer en ligne" button (external payment link), vouchers for individuals and companies |
| `/actualites` | news (dated, photo + text, newest first, share buttons) + agenda of upcoming events |
| `/recits` | memorable flight stories with optional WeGlide link |
| `/galerie` | photo gallery with lightbox |
| `/webcam` | live webcam image, refreshed every minute |
| `/liens` | grouped external links (Institutions, Préparation de vol, Météo, Communauté) |
| `/contact` | contact form + map (Leaflet/OpenStreetMap) + address |

Global: a header with 5 main entries and dropdowns, a full menu, the FR/EN toggle and a sticky header. The footer has navigation, contact and social links.

## Constraints

- **Stack**: Next.js 15 + Tailwind CSS 4 utility classes only (no CSS-in-JS). Fonts must come from Google Fonts or be self-hosted via `next/font`.
- **Mobile first**: test at 375 px. Tap targets must be at least 44 px.
- **Accessibility**: WCAG AA contrast, visible keyboard focus, alt text, `prefers-reduced-motion` respected.
- **Light only** for now (dark mode optional, not required).
- **No personal data**: no member names or faces singled out, no instructor names.
- **Empty states**: every Sanity-fed block needs a graceful "Bientôt ici" state. The placeholder for a missing photo needs a better idea than the current clip-art.
- **Performance**: photos come from the Sanity CDN, resized. Animations should stay light (CSS or small JS).

## What I want back

1. A visual direction: type pairing, color tokens, spacing scale, radius, shadows and motion principles.
2. High-fidelity mockups of **Accueil**, **Venez essayer** and **Le club**, at desktop and mobile width.
3. Components: header + full menu, hero, section heading, card, price table, news row, agenda item, button styles, photo placeholder, footer.
4. Notes on how the other pages reuse those components.
5. Output the tokens as a Tailwind 4 `@theme` block so they drop into `src/app/globals.css`.

## Assets

- Logo: `public/logo.png`, `public/logo-icon.png`
- Fleet photos: `public/images/fleet/`
- Screenshots of the current site: on request, or open `npm run dev` → `http://localhost:3000/fr`
