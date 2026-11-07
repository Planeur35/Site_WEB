# Redesign handoff: "Ciel & marine"

Implementation brief for Claude Code. It turns the redesign mockups into code, one pull request at a time.

- **Brief it answers:** `docs/design-handoff.md`.
- **Mockups:** `docs/redesign/mockups/*.html` (copied from the Claude Design canvas, which is private to Hamid).
- **Status:** visual direction approved for implementation. Content marked `[like this]` in the mockups is missing club data, never copy to ship (see "Open questions").

## How to use this document

1. Work through **Steps** in order. Each step is one branch and one pull request, and ends on a **Done when** list. A step is finished only when every item on that list is true.
2. Look values up in the **Reference** sections (tokens, components, pages, strings, Sanity) as each step needs them.
3. The mockups are the visual source of truth for spacing, sizes and layout. Their inline styles carry exact px and hex values: translate each value to the matching token or Tailwind step from the Reference, never paste hex or inline styles into the code.
   - The mockups are canvas sources, not runnable pages. Read them as annotated HTML.
   - Image paths in them point to `public/`.
4. Use the anchors in `CLUB_ANCHORS` (`#activites`, `#ecole-campagne`…), even where a mockup shows a shorter `id`.
5. Where this document and the **Styling** section of `AGENTS.md` disagree, this document wins. Step 1 rewrites that section so the two agree again.

All other rules in `AGENTS.md` still hold:

- i18n keys exist in both `fr.json` and `en.json`;
- `sanityFetch` with a fallback;
- `revalidate = 60`;
- `Link` from `@/i18n/navigation`;
- Server Components by default;
- one PR per topic;
- `npm run lint` and `npm run build` must pass;
- visual check at `/fr` and `/en`, at 1440 px and 375 px wide.

## The direction in one paragraph

White and pale sky blue carry the mood. Large photos lead each page. Titles use **Inter Tight** and text uses **Inter**: no serif, no small grey capitals.

**Marine blue** (token `balise`, deeper than the links) has one job: the main action on a screen (Réserver, Venez essayer), plus eyebrows. Show at most one filled button per viewport. The only warm note is **sable**, a soft sand used for the trace dot and nothing else. (The first version used an orange accent; the club found it too loud.)

Corners are square-ish (2, 4 and 6 px). There are no shadows except on what floats, and very few boxes or rules.

When a photo or content is missing, the block shows a pale sky with a thin **flight trace**: an approach, a thermal spiral, then a glide ending on a small sand-coloured dot. It never shows clip-art.

---

## Steps

### Step 1 — Tokens, fonts, rules · branch `feat/design-tokens`

1. In `src/app/globals.css`:
   - replace the `@theme` block with the one in **Reference › Tokens**;
   - keep `:focus-visible`, but point it at `var(--color-altitude)`;
   - keep the reduced-motion block;
   - update `.prose-piv` per **Reference › Long text**.
2. Load the fonts with `next/font/google` in `src/app/[locale]/layout.tsx`:
   - `Inter_Tight({ subsets: ['latin', 'latin-ext'], weight: ['500', '600', '700'], variable: '--font-inter-tight', display: 'swap' })`
   - `Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter', display: 'swap' })`
   - Put both `.variable` classes on `<html>`.
3. Set the body classes to `bg-blanc font-sans text-texte antialiased`.
4. Rewrite the **Styling** section of `AGENTS.md` to describe this system:
   - tokens, and when to use each colour;
   - Inter Tight / Inter, and the marine-only-for-the-main-action rule;
   - the 2/4/6 px radii;
   - placeholders via `FlightTrace`;
   - "no raw hex, no `font-serif`, no uppercase tracking labels";
   - a pointer to this document.

   Keep it short: point to this document rather than copying it.

**Done when:**

- the new tokens produce utilities (`bg-ciel`, `text-azur`, `text-balise`, `font-display`, `text-h2`, `shadow-flottant`, `ease-planeur`, `animate-montee`);
- body text renders in Inter, and the old components still work (their `font-serif` headings stay until Step 2);
- `AGENTS.md` no longer mentions serif titles, small capitals or Georges's Site_WEB as the current design;
- lint and build pass.

### Step 2 — Primitives · branch `feat/design-primitives`

Rebuild the shared UI components in `src/components/ui/` per **Reference › Components**:

- `Button`;
- `TextLink`, which becomes the arrow link;
- `Kicker`, which becomes the marine eyebrow;
- `Section`;
- `Tag`;
- `EmptyState`;
- `SanityPhoto`, whose placeholder becomes `FlightTrace`;
- `PageHero`;
- `NewsRow`.

Add `FlightTrace.tsx` and `Container.tsx`. Delete `SkyVisual.tsx` and `GliderSilhouette.tsx` once nothing imports them.

Keep each component's props API where you can, so the pages keep compiling. When an API must change, update every call site in the same PR.

**Done when:**

- `grep -rn "font-serif\|uppercase\|tracking-\[" src/components/ui` returns nothing;
- `SkyVisual` and `GliderSilhouette` are gone;
- every page still renders at `/fr` and `/en` (pages restyle through the primitives);
- a page with no Sanity photo shows the flight trace;
- lint and build pass.

### Step 3 — Header, full menu, footer · branch `feat/design-header-footer`

Implement **Reference › Header**, **Full menu** and **Footer** in `src/components/layout/`. Add `NAV_GROUPS` to `navItems.ts` (see Header). Keep `CLUB_ANCHORS` values unchanged.

**Done when:**

- the header shows 4 text entries and the filled "Venez essayer" button from `xl`, and logo + Venez essayer + Menu below that;
- dropdowns open on hover, focus and click, and the keyboard works in them (Tab, Enter, Escape);
- the full menu traps focus, closes on Escape and on navigation, and renders as 4 groups (desktop) or accordions (mobile);
- the current page is marked with `aria-current="page"` and the marine underline;
- the footer hides the legal-notice link until that page exists (known issue);
- lint and build pass, and the result has been checked at 1440 and 375 px.

### Step 4 — Home · branch `feat/design-home`

Implement **Reference › Pages › Accueil**:

- rewrite `HeroSlideshow`;
- add `CountUp`;
- add the 3 card photo fields, the gift band and the members strip.

Mockups: `Accueil.html` and `AccueilMobile.html`.

**Done when:**

- the hero text sits on white above the photo, never over it;
- the slideshow has pause, previous and next buttons, stops autoplay under reduced motion, and keeps the first slide's title as the `h1`;
- the price line comes from the `vol-initiation` tariffs and is hidden when there are none;
- each key figure hides when its value is empty, and the whole band hides when all are empty;
- every card, news item and band renders correctly both with and without a photo;
- lint and build pass, and the result has been checked at 1440 and 375 px.

### Step 5 — Venez essayer · branch `feat/design-decouvrir`

Implement **Reference › Pages › Venez essayer**, including the new optional Sanity fields. Mockups: `Decouvrir.html` and `DecouvrirMobile.html`.

**Done when:**

- the booking button uses `paymentUrl`, falls back to `/contact` with the existing `contactCta` label, and shows the "you are leaving the site" note only with `paymentUrl`;
- each practical-info item renders only when its field is filled;
- the mobile booking bar is hidden while the price panel is on screen;
- lint and build pass, and the result has been checked at 1440 and 375 px.

### Step 6 — Le club · branch `feat/design-club`

Implement **Reference › Pages › Le club**, including `SectionNav` and `TrainingPath`. Mockups: `Club.html` and `ClubMobile.html`.

**Done when:**

- section numbers run 01, 02… over the sections that actually exist;
- the anchor bar highlights the section in view and scrolls horizontally on mobile;
- `TrainingPath` renders from i18n strings, unless an editor has uploaded a `diagram`, in which case that image renders instead;
- the history reads as a long read in a 680 px column, with photos wider than the column;
- every existing anchor (`#formation`, `#activites`…) still works from the menus;
- lint and build pass, and the result has been checked at 1440 and 375 px.

### Step 7 — The other pages · branch `feat/design-pages` (split it if it grows past ~600 lines of diff)

Apply **Reference › Pages › Other pages** to:

- `planeurs`, `adherer`, `actualites` and `actualites/[slug]`;
- `recits`, `galerie`, `webcam`, `liens`, `contact`;
- `not-found`, `error` and `loading`.

**Done when:**

- `grep -rn "font-serif\|uppercase tracking\|sky-[0-9]\|slate-[0-9]" src` returns nothing;
- every page has been checked at `/fr` and `/en`, at 1440 and 375 px, with Sanity content present and with it empty;
- lint and build pass.

---

## Reference › Tokens

Paste this as the `@theme` block in `src/app/globals.css`:

```css
@theme {
  /* Type: next/font exposes --font-inter-tight and --font-inter on <html> */
  --font-display: var(--font-inter-tight), ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;

  /* Colour: ciel & marine */
  --color-blanc: #ffffff;        /* page background */
  --color-ciel: #f1f6fb;         /* alternate band, panels, price tables */
  --color-horizon: #dcebf7;      /* hairlines on ciel, chips, progress track */
  --color-zenith: #d5e7f5;       /* top of the placeholder sky */
  --color-brise: #edf5fb;        /* middle of the placeholder sky */
  --color-altitude: #1a68b0;     /* links, focus ring, icons (5.8:1 on white) */
  --color-azur: #0f3a64;         /* headings (11.6:1) */
  --color-nuit: #0b1a2a;         /* strong text, footer and lightbox background */
  --color-texte: #33465a;        /* body copy */
  --color-brume: #5b6b7b;        /* secondary text (5.5:1 on white, 5.0:1 on ciel) */
  --color-nuage: #c9d6e3;        /* footer text on nuit */
  --color-givre: #9fb3c8;        /* footer fine print on nuit (8.2:1) */
  --color-balise: #1d5c96;       /* marine: the one action button, eyebrows; white text 7:1 */
  --color-balise-fonce: #164a7a; /* its hover/active */
  --color-balise-vif: #c9a77a;   /* sable: decoration only (trace dot); never text */

  /* Type scale (desktop values; mobile classes in the table below) */
  --text-display: 5.5rem;   --text-display--line-height: 1;    --text-display--letter-spacing: -0.035em;
  --text-h1: 4.75rem;       --text-h1--line-height: 1;         --text-h1--letter-spacing: -0.035em;
  --text-h2: 2.5rem;        --text-h2--line-height: 1.1;       --text-h2--letter-spacing: -0.02em;
  --text-h3: 1.75rem;       --text-h3--line-height: 1.15;      --text-h3--letter-spacing: -0.015em;
  --text-h4: 1.375rem;      --text-h4--line-height: 1.25;      --text-h4--letter-spacing: -0.01em;
  --text-lead: 1.3125rem;   --text-lead--line-height: 1.55;
  --text-body: 1.125rem;    --text-body--line-height: 1.65;

  /* Elevation: only what floats (scrolled header, dropdowns, full menu, map label) */
  --shadow-flottant: 0 12px 32px -12px rgb(11 26 42 / 0.22), 0 0 0 1px rgb(11 26 42 / 0.05);

  /* Motion */
  --ease-planeur: cubic-bezier(0.2, 0.7, 0.2, 1);
  --animate-montee: montee 600ms var(--ease-planeur) both;
  @keyframes montee {
    from { opacity: 0; translate: 0 12px; }
    to   { opacity: 1; translate: 0 0; }
  }
}
```

### Radius

Tailwind 4's defaults already match, so add no token:

- `rounded-xs` (2 px): tags, date chips, anchor chips;
- `rounded-sm` (4 px): buttons, fields, menus, thumbnails;
- `rounded-md` (6 px): photos, panels, cards, price tables.

Use nothing larger, and no pills.

### Spacing

Use Tailwind's 4 px scale, limited to the steps 1, 2, 3, 4, 6, 8, 12, 16, 24 and 32.

**Section rhythm**

| Context | Spacing |
|---|---|
| Between sections, desktop | `py-28` / `py-32` (112–128 px) |
| Between sections, mobile | `py-16` / `py-18` (64–72 px) |
| Heading block to content | `mb-12` (48 px) desktop, `mb-7` mobile |

**Container:** `Container` = `mx-auto max-w-7xl px-5 sm:px-8 lg:px-10`. That is 1280 px of content, with 20 px gutters on a phone.

**Grids**

| Layout | Classes |
|---|---|
| Cards | `grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3` |
| Key figures | `grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4 lg:gap-x-6` |

### Type classes

| Role | Mobile | From `lg` | Font |
|---|---|---|---|
| Home hero title | `text-[3rem] leading-[1.02]` | `text-display` | `font-display font-semibold text-azur tracking-[-0.035em]` |
| Page `h1` | `text-[2.75rem] leading-[1.03]` | `text-h1` | same |
| `h2` | `text-[1.875rem] leading-[1.12]` | `text-h2` | `font-display font-semibold text-azur` |
| Card / section `h3` | `text-2xl` | `text-h3` | same |
| News, step and agenda title | `text-[1.1875rem]` | `text-h4` | same |
| Lead (chapô) | `text-[1.1875rem] leading-[1.55]` | `text-lead` | `text-texte` |
| Body | `text-[1.0625rem] leading-[1.7]` | `text-body` | `text-texte` |
| Small, meta | `text-[0.9375rem]` | same | `text-brume` or `text-texte` |
| Eyebrow (Kicker) | `text-[0.9375rem]` | `text-base` | `font-display font-semibold text-balise`, sentence case |
| Key figure | `text-[2.75rem] leading-none` | `text-[4rem]` | `font-display font-semibold text-azur tabular-nums tracking-[-0.03em]` |
| Price | `text-[2.125rem]` | `text-[2.5rem]` | same as key figure |

Line length: at most about 68 characters, so `max-w-[680px]` on long text and `max-w-[640px]` on leads.

### Colour usage

- **Page background:** `bg-blanc`. Use `bg-ciel` for one alternate band per page at most two times in a row, and for panels.
- **Headings:** `text-azur`. **Body:** `text-texte`. **Meta and dates:** `text-brume` (dates on cards are `text-nuit font-semibold`).
- **Links:** `text-altitude font-semibold`, no underline at rest, underline on hover with `decoration-2 underline-offset-4`. Links inside `.prose-piv` keep an underline at rest.
- **Marine (`balise`)** is used for:
  - the primary button;
  - eyebrows;
  - the active-page underline;
  - the slideshow progress fill;
  - the map pin;
  - the last step of the training path.

  It is never used for body text or for large areas.
- **Footer:** `bg-nuit text-nuage`; headings `text-white`; fine print `text-givre`.

### Focus

```css
:focus-visible { outline: 2px solid var(--color-altitude); outline-offset: 3px; }
```

Use it on every interactive element. On `bg-nuit`, use `outline-white`.

## Reference › Motion

There is one easing, `ease-planeur`. Use CSS only, plus one small client hook (`useInView`, built on `IntersectionObserver`), shared by `Reveal` and `CountUp`.

| Name | What | Spec |
|---|---|---|
| Fondu ciel | Hero cross-fade | 1200 ms opacity cross-fade every 7 s. The incoming photo scales 1.04 → 1 over 7 s. |
| Montée | Blocks entering the viewport | `animate-montee`, once. Siblings in a row are staggered 60 ms apart (`style={{ animationDelay }}`). Wrap blocks in a `Reveal` client component that adds the class when in view. |
| Compteur | Key figures | Count from 0 to the value over 900 ms the first time they are seen. The final number is server-rendered; the animation replaces it client-side, and screen readers get the final value (`aria-label`). |
| Réponse | Hover and press | 160 ms: buttons darken, arrow icons translate 4 px, photos in links `scale-[1.03]` inside an `overflow-hidden` frame. |

Under `prefers-reduced-motion: reduce`:

- no autoplay;
- no Montée (content visible immediately);
- no count-up;
- hover changes colour only.

The existing global reduced-motion block in `globals.css` stays.

## Reference › Components

### `Container`

Already defined in Tokens › Spacing. Use it everywhere instead of the current per-page `max-w-5xl px-4 sm:px-6 md:px-8`.

### `Button` (variants)

| Variant | Classes | Use |
|---|---|---|
| `primary` | `bg-balise text-white hover:bg-balise-fonce` | The one main action: Réserver, Venez essayer |
| `secondary` | `border-[1.5px] border-azur bg-blanc text-azur hover:bg-ciel` | Second action |
| `onDark` | `bg-white text-nuit hover:bg-nuage` | On the footer or dark panels |

**Common classes:** `inline-flex items-center justify-center gap-2.5 rounded-sm px-[22px] font-semibold text-base transition-colors duration-150 ease-planeur`.

**Heights:**

- `h-12` (48 px) by default;
- `h-13` (52 px) for the hero CTA and the price-panel CTA;
- `h-11` (44 px) in the header.

**Props:**

- `fullWidth` gives `w-full`, used for mobile CTAs;
- `external` (existing prop) adds a trailing "external" icon (lucide `ExternalLink`, 18 px) and keeps `target="_blank" rel="noopener noreferrer"`.

Rename the old `solid` to `primary` and `outline` to `secondary`, and update every call site. Use sentence case: no `uppercase`, no letter-spacing.

### `TextLink` (arrow link)

`inline-flex items-center gap-2 min-h-11 font-semibold text-base text-altitude` + lucide `ArrowRight` (18 px) after the label.

- The arrow does `group-hover:translate-x-1`.
- External links use `ArrowUpRight`.

### `Kicker` (eyebrow)

`font-display font-semibold text-[0.9375rem] lg:text-base text-balise` with `mb-3`.

- Remove the `light` prop: no kicker sits on a photo any more.
- Optional `number` usage: Le club passes `"01"`, `"02"`… as children.

### `Section` (section heading + body)

**Props:** `id`, `kicker`, `title`, `sub`, `action?: { href, label }`, `band?: boolean`, `children`.

**Layout:**

- a heading block: Kicker, then `h2`, then optional `sub` as a Lead (`max-w-[640px]`, `mt-4`);
- with `action`, a flex row: `flex flex-wrap items-end justify-between gap-x-8 gap-y-4`, with `TextLink` on the right. The link wraps under the title on mobile.

**Spacing:** `py-16 lg:py-28`, `scroll-mt-36` (header + anchor bar). The body comes after `mt-7 lg:mt-12`.

**Background:** `band` wraps the section in a full-width `bg-ciel`.

### `FlightTrace` (new)

The placeholder for every missing photo. A Server Component.

```tsx
interface FlightTraceProps {
  seed: string;          // usually the item's title or _id: same seed, same trace
  className?: string;    // frame size / aspect, e.g. "aspect-[4/3] rounded-md"
  dotClassName?: string; // default "fill-balise-vif"
}
```

**Frame:**

- `relative overflow-hidden bg-linear-to-b from-zenith via-brise via-62% to-[#f7fafd]`;
- use `to-ciel` if a raw value is refused.

**Path:**

- an inline `<svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">`, absolutely filling the frame;
- the trace is `fill-none stroke-altitude` with `stroke-opacity: 0.45`, `stroke-width: 1.5`, round joins and caps, and `vector-effect: non-scaling-stroke`;
- an end-dot `<circle r="5">` in `fill-balise-vif`.

Generate the path from the seed:

```ts
// FNV-1a hash, then a tiny PRNG (mulberry32) for repeatable variety
function hash(s: string) { let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0)!; h = Math.imul(h, 16777619); } return h >>> 0; }
function prng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export function tracePath(seed: string) {
  const r = prng(hash(seed));
  const x0 = 120 + r() * 120, y0 = 210 + r() * 30;      // thermal entry
  const loops = 3.5 + r() * 1.5, rad = 30 + r() * 10;   // turns and radius
  const climb = 30 + r() * 4, drift = 10 + r() * 14;    // per turn (wind drift)
  const end = { x: 540 + r() * 30, y: 120 + r() * 50 }; // glide end = dot
  const mirror = r() < 0.5;
  const k = 18, n = Math.round(loops * k);
  const pts: [number, number][] = [[x0 - 90, y0 + 30]];
  for (let i = 0; i <= n; i++) {
    const t = (i / k) * 2 * Math.PI, turns = t / (2 * Math.PI);
    pts.push([x0 + drift * turns + rad * Math.sin(t), y0 - climb * turns - rad * 0.42 * (1 - Math.cos(t))]);
  }
  pts.push([end.x, end.y]);
  const m = (x: number) => (mirror ? 600 - x : x);
  return {
    d: pts.map(([x, y], i) => `${i ? 'L' : 'M'}${Math.round(m(x))} ${Math.round(y)}`).join(' '),
    end: { x: Math.round(m(end.x)), y: end.y },
  };
}
```

The trace is decorative. The `alt` belongs on nothing, and the surrounding card's title carries the meaning.

**Variants:**

- **Glider card without photo** (`/planeurs`): the frame shows the aircraft's `callsign` (contest letters) in `font-display font-bold text-[5.25rem] text-azur`, over a stylised tail fin.
  - The fin is an SVG path `M40 160 L78 18 Q80 10 88 10 L128 10 Q136 10 134 18 L118 160 Z`, in `fill-white/85 stroke-altitude/35`, bottom right.
  - Without a callsign, fall back to the trace.
- **Thumbnail** (≤ 120 px): crop the viewBox to `40 40 520 240` with `preserveAspectRatio="xMidYMid slice"`, so the spiral fills the square.

### `SanityPhoto`

Same API. When `image?.asset` is missing, render `<FlightTrace seed={label ?? 'piv'} className={className} />`.

- Drop the `label` text overlay: the placeholder carries no words.
- Frame classes always include `rounded-md` unless the caller overrides them.

### `PageHero`

| Prop | Behaviour |
|---|---|
| `breadcrumb` | Optional; defaults to Accueil / title. |
| `kicker` | Eyebrow. |
| `title` | Page `h1`. |
| `lead` | Optional. |
| `image` | Optional. |
| `aside` | Optional `ReactNode`, e.g. the price panel. |

**Layout, on white, never over the photo:**

- breadcrumb (`text-sm text-brume`, `mb-7`);
- then a flex row `flex flex-wrap items-end gap-x-16 gap-y-6`:
  - left: `flex-[999_1_560px]` with Kicker and `h1`;
  - right: `flex-[1_1_340px]` with the lead, or the `aside`.

**Photo:** below, `mt-12`, `h-[clamp(280px,38vw,540px)] rounded-md`, with `priority`.

**Without a photo:** no photo row, no sky band; the hero ends after the text.

**Spacing:** `pt-12 lg:pt-16`.

Remove the `variant` prop.

### `Tag`

`rounded-xs bg-horizon px-2 py-[3px] text-sm font-medium text-azur`, sentence case.

### `EmptyState` ("Bientôt ici")

A `FlightTrace` frame `h-[300px] rounded-md flex items-center px-12` (mobile: `h-60 px-6`) with the trace aligned right (`preserveAspectRatio="xMaxYMid meet"`). Its text block (`max-w-[360px]`) contains:

- a title (`font-display font-semibold text-[2rem] text-azur`, default `club.emptyTitle` "Bientôt ici");
- the existing empty message as children (`text-texte`);
- an optional `action` `TextLink`.

Keep the existing message keys.

### `NewsRow` (list) and `NewsCard` (home)

**`NewsRow`, used on `/actualites`:**

- grid `grid-cols-[1fr_200px] gap-7`, `py-7`, `border-t border-horizon`;
- left: date (`text-sm font-semibold text-nuit`) + `Tag`, title `text-h4`, excerpt `line-clamp-2`, then "Lire la suite" + `ShareButtons` (icon button 44 px);
- right: a 4:3 `SanityPhoto` (`rounded-md`);
- on mobile, the photo becomes a 96×96 thumbnail to the right of date + title, the excerpt hides, and each row is a `bg-blanc rounded-md p-3.5` card on a `bg-ciel` band.

**`NewsCard` (new), used on Accueil:**

- 16:10 photo or `FlightTrace` (`rounded-md`), date + `Tag`, `h3` title as the link, a 2–3 line excerpt;
- the whole card is not one link: the title is, so the text stays selectable and the focus order stays clean.

### `AgendaItem` (new)

- `grid grid-cols-[72px_1fr] gap-4.5 p-4.5 bg-ciel rounded-md`.
- Date tile: `size-[72px] bg-blanc rounded-sm`, day number `font-display text-[1.875rem] text-azur`, month `text-[0.8125rem] font-semibold text-balise` (short form "avr.").
  - A multi-day event shows `3–7` in a smaller size (`text-[1.375rem]`), with the month below.
- Right column: title `text-h4`, then meta: weekday · `news.at` time · location.

Empty state: a `bg-blanc` box with `inset 0 0 0 1px horizon` holding `news.agendaEmpty` + a link to news.

### `PriceTable` (new, `/adherer`)

- A semantic `<table>` in a `bg-ciel rounded-md px-8 pt-3 pb-7` panel.
- `<caption>` as an `h3`.
- Columns: offer, then one per age category (`pricing.ages.*`).
- Row header: offer name (`font-display text-xl text-azur`) + the tariff `details` below it (`text-texte`).
- Prices: right-aligned price style (`tabular-nums`).
- Hairlines: `border-horizon`.
- A missing price reads `pricing.onRequest` ("Sur demande"), never an empty cell.
- **Mobile:** each offer becomes a block (name, then the age categories side by side as two figure + label pairs).

### `TrainingPath` (new, Le club)

**Desktop (`lg`+):** a `figure` in a `bg-blanc rounded-md p-8 lg:px-8 lg:pt-10` panel, captioned `club.pathTitle`.

- A 200 px-tall track holds one decorative SVG (`viewBox 0 0 1000 200`, `preserveAspectRatio="none"`):
  - a dashed takeoff segment `M0 196 L100 180`;
  - a solid rising line through `100,180 300,140 500,100 700,60 900,20` (`stroke-altitude`, 2 px, non-scaling);
  - a dashed marine segment onward to `1000,6`.
- Five absolutely-positioned dots at `left: calc(10%|30%|50%|70%|90% - 9px)`, `top: 171|131|91|51 px` and `9 px` for the last:
  - 18 px white with a 3 px `altitude` inset ring;
  - the last is 22 px `bg-balise` with a 6 px `balise/15` halo.
- Below: an `<ol>` with `grid-cols-5`, centred text. Each item has a label ("Étape 1"… and "Et ensuite" in `text-balise`), an `h3` (`text-[1.1875rem]`) and a sentence.

**Mobile:** a vertical list read bottom-to-top. Use `flex-col-reverse` on the `<ol>` so DOM order (and screen-reader order) stays step 1 → 5. Each item has:

- a 16 px dot;
- a 2 px `altitude` line running down to the step below;
- the last step's dot in marine.

Strings: `club.pathStep1…5Title/Text` (see Strings). If the training `clubPage.diagram` image is set, render it instead (an editor's choice wins).

### `SectionNav` (new, client, Le club)

- Sticky under the header: `sticky top-20 z-30 bg-blanc/94 backdrop-blur border-b border-horizon`.
- Links are 56 px tall, `px-3.5`, `text-[0.9375rem]`.
- Active link: `font-semibold text-azur shadow-[inset_0_-2px_0_var(--color-balise)]` + `aria-current="location"`. Others: `text-texte`.
- An `IntersectionObserver` (`rootMargin: '-40% 0px -55% 0px'`) sets the active section.
- `overflow-x-auto` row with `scroll-snap-type: x proximity`.
- **Mobile:** 36 px chips (`rounded-xs bg-ciel text-azur`; active `bg-azur text-white`) in a horizontal scroller under the 64 px header (`top-16`).

### `CountUp` (new, client)

Renders the final value in the server HTML. On first view, without reduced motion, it animates from 0 over 900 ms with `ease-planeur`. Use `tabular-nums` so the width doesn't jump.

### Header

**Desktop (from `xl`, 1280 px):**

- `h-20`, sticky, `bg-blanc/92 backdrop-blur`, with `shadow-flottant` only once the page has scrolled more than 8 px (a client listener).
- Left: logo icon `next/image` (44×39, the existing `logo-icon.png`, `priority`) + "PIV" (`font-display font-bold text-lg text-azur`) + `common.clubName` (`text-[0.8125rem] font-medium text-brume`, hidden below `sm`).
- Nav: 4 entries from `HEADER_NAV` except `discover`, each `h-11 px-3.5 text-base font-medium text-nuit`. The active one gets `font-semibold text-azur underline decoration-balise decoration-2 underline-offset-[10px]`. Entries with `children` show a 16 px `ChevronDown`.
- Right:
  - `LanguageToggle`, as two 44 px links "FR" and "EN"; the current one is `text-azur` with a marine underline, the other `text-brume`, with `lang="en"` on EN;
  - `Button primary h-11` "Venez essayer". On `/decouvrir` it becomes `secondary`-styled marine outline (`border-balise text-balise`) with `aria-current="page"`;
  - the Menu button (44 px, `Menu` icon + "Menu" label from `sm`).

**Below `xl`:** logo, then on the right "Essayer" (`nav.discoverShort`, primary `h-11`) and the Menu button. The language toggle moves into the full menu.

**Dropdown:**

- a panel `w-[420px] p-3 bg-blanc rounded-md shadow-flottant` at `top-full mt-2`;
- rows are 44 px, `px-3 rounded-sm`, with `bg-ciel` on hover and focus;
- for Le club, each row shows its section number in `text-brume text-[0.8125rem]` on the right;
- opens on hover (120 ms intent delay), on focus-within, and on click (`aria-expanded`); Escape closes it and returns focus to the trigger.

**`navItems.ts`:** add `cta?: true` to the `discover` entry, and a `NAV_GROUPS` export used by the full menu and the footer:

```ts
export const NAV_GROUPS = [
  { key: 'groupFly', items: ['discover', 'join', 'gliders'] },
  { key: 'groupClub', items: [/* CLUB_ANCHORS children, plus 'training' first-class */] },
  { key: 'groupNews', items: ['newsList', 'agenda', 'stories', 'gallery'] },
  { key: 'groupPractical', items: ['webcam', 'links', 'contact'] },
];
```

Shape it as you see fit, but derive the hrefs from the existing entries: never duplicate a path.

### Full menu

Opened by the Menu button. It is a full-viewport overlay (`fixed inset-0 z-50 bg-blanc overflow-y-auto`), with focus trapped and body scroll locked. Escape and route changes close it, and focus returns to the Menu button.

**Desktop:**

- a top row with the logo and a "Fermer" button (`X` icon);
- then 4 columns (`grid-cols-4 gap-6`). Each starts with a group label (`font-display font-semibold text-sm text-balise`). Fly links are large (`font-display font-semibold text-xl text-azur`, 40 px rows); the others are `text-base text-nuit` (34 px rows, 44 px hit area through padding);
- a bottom `bg-ciel rounded-md` strip: "Vol d'initiation" + price line, a `primary` "Réserver" button, and the language toggle.

**Mobile:**

- 4 accordion groups (`button aria-expanded`, `font-display font-semibold text-2xl text-azur`, 56 px rows with `border-t border-horizon`); "Voler" is open by default, and links inside are 44 px, `text-[1.0625rem]`;
- a bottom `bg-ciel` block: a full-width `primary` "Réserver un vol d'initiation" button, a "Français · English" toggle, and a Contact link.

### Footer

`bg-nuit text-nuage`, in a `Container` with `pt-20 pb-10`.

**Upper row (flex-wrap):**

- **Identity column** (`flex-[1_1_300px]`):
  - logo icon 54×48 + "Planeurs / d'Ille-et-Vilaine" (`font-display font-semibold text-xl text-white`, two lines);
  - `settings.address` (`whitespace-pre-line`);
  - email (white link) and phone, each only if set;
  - an `onDark` "Nous écrire" button (`h-11`) to `/contact`.
- **Nav** (`flex-[2_1_560px]`, `grid` of `minmax(150px,1fr)` auto-fit): one column per `NAV_GROUPS` group. Headings are `font-display font-semibold text-white`; links are `text-[0.9375rem] text-nuage min-h-9`. `settings.socialLinks` and the WeGlide link go in the Pratique column.

**Bottom bar:** `border-t border-nuage/18 pt-6 text-sm text-givre`, with "© Planeurs d'Ille-et-Vilaine" and the "English version" / "Version française" link.

- The legal-notice link renders only when the page exists (known issue).
- **Mobile:** a 2-column nav (Voler, Le club), with socials and the language link in the bottom bar.

### Long text (`.prose-piv`)

| Element | Style |
|---|---|
| Body | `font-size: 1.1875rem` (19 px) on desktop, `1.0625rem` on mobile; `line-height: 1.75`; colour `--color-texte`; max width 680 px (set by the caller) |
| `h2`, `h3` | `font-display`, weight 600, colour `--color-azur`; h2 `1.75rem`, h3 `1.375rem`; `margin-top: 1.6em` |
| Links | `--color-altitude`; underline `--color-horizon`, `2px`, offset `0.2em`; on hover the underline turns `--color-altitude` |
| `blockquote` | The pull quote: no border; `font-display`, weight 500, `2rem/1.25` (mobile `1.5625rem`), colour azur, `letter-spacing: -0.015em`; `«` and `»` in `--color-balise` via `::before` / `::after`; margin `1.5rem 0` |
| `figure` (PortableText image) | Breaks out of the column on `lg`: `margin-inline: calc((680px - min(1040px, 100vw - 80px)) / 2)`, `border-radius: 6px`; figcaption `0.9375rem`, colour `--color-brume`, constrained to the 680 px column |

**Anecdote callout** (the history `anecdotes`): `bg-ciel rounded-md px-9 py-8` with:

- a label: the `Route` lucide icon (or the trace glyph) + `club.anecdote`, in `text-balise font-display font-semibold`;
- an `h4` title;
- the text in `text-[1.0625rem]`.

Anecdotes render after the body, as today. Inline placement inside the text would need a custom Portable Text block, which is not in scope.

---

## Reference › Pages

`[N]`, `[AAAA]` and `[...]` in the mockups are placeholders for missing club data: implement them as "render when present, hide when empty".

### Accueil (`src/app/[locale]/page.tsx`) — `Accueil.html`, `AccueilMobile.html`

1. **Hero** (`HeroSlideshow`, client), on white:
   - an eyebrow `home.heroKicker`;
   - the slide `title` (`text-display`; the first slide renders as `h1`, the others as `p`, cross-faded in place in a CSS grid stack: `grid [&>*]:col-start-1 [&>*]:row-start-1`);
   - on the right: the slide `subtitle` (Lead), the `primary h-13` CTA `home.heroCta` → `/decouvrir`, and the price line `home.heroPrice` from the `vol-initiation` tariffs (adult first);
   - below: the photo frame `mt-12 h-[clamp(320px,44vw,600px)] rounded-md`;
   - below the photo: a control row with a counter "01 / 04" (`font-display font-semibold text-azur tabular-nums`, total in `text-brume`), 4 progress bars (`w-14 h-[3px] rounded-xs bg-horizon`, the active one fills `bg-balise` over the interval; `w-8` on mobile), and on the right pause/play, previous and next (44 px icon buttons, labels `home.slidePause/slidePlay/slidePrev/slideNext`);
   - with 1 slide, hide the controls;
   - without `heroSlides`, use the existing fallback (`home.heroTitle` + tagline) and a `FlightTrace` frame;
   - **mobile:** the eyebrow, `h1` at 48 px, the Lead, a full-width CTA, a centred price line, then a 420 px-tall photo; the controls keep the counter, bars and pause only.
2. **Key figures:** `Container py-24`, 4 figures (`CountUp`) with labels below in `text-[1.0625rem] text-texte`. The existing filter on null values stays. 2×2 on mobile.
3. **Entry cards:** a `Section` with eyebrow `home.startKicker`, `h2` `home.startTitle`, and the 3 existing cards. Each has:
   - a 4:3 photo from the new `siteSettings.homeCardImages.{try,learn,join}` fields, or `FlightTrace` seeded by the title;
   - its kicker, an `h3` and the text;
   - a `TextLink` (`home.cardTryCta`, `cardLearnCta`, `cardJoinCta`).

   The try card's text appends the price sentence `home.cardTryPrice` when tariffs exist. The whole card is one `Link` with an inner `group`; the photo scales on hover.
4. **Latest news:** a `Section band` with eyebrow `home.latestKicker`, `h2` `home.latestTitle`, and `action` = `home.allNews` → `/actualites`. Show 3 `NewsCard`s. On mobile they become the compact `NewsRow` cards. Hide the section when there are no articles (as today).
5. **Gift band:**
   - a 3:2 photo (new `siteSettings.giftImage`, fallback `FlightTrace`) left, with text right: eyebrow `home.giftKicker`, `h2` `home.giftTitle`, body `home.giftText`;
   - `secondary` "Offrir un vol" → `/decouvrir#bons`, and a `TextLink` "Offre entreprises" → `/contact`;
   - stacked on mobile.
6. **Members strip:** a `bg-ciel rounded-md p-10` panel with `h2` `home.membersTitle` (`text-2xl`) and 4 tiles (`bg-blanc rounded-sm min-h-16 px-4.5`, lucide icon in `text-altitude` + label):
   - Webcam (with `home.webcamLive` in `text-brume` on the right; hide it when `webcamUrl` is empty);
   - Agenda;
   - Récits de vols;
   - Liens pratiques.

   2×2 tiles on mobile, with the icon above the label.

### Venez essayer (`decouvrir/page.tsx`) — `Decouvrir.html`, `DecouvrirMobile.html`

1. **`PageHero`:** eyebrow `discover.kicker`, `h1` `discover.title` ("Offrez-vous le ciel"), Lead = `siteSettings.discoveryText` ?? `discover.defaultDescription`, and photo = new `siteSettings.discoveryImage`.

   The `aside` is the **price panel**:
   - `bg-ciel rounded-md p-8`;
   - one row per `vol-initiation` tariff: age label left, price right; hairline between rows;
   - the `primary h-13 fullWidth` CTA `discover.bookingCta` with the `external` icon → `paymentUrl`;
   - below it, `text-sm text-brume`: `discover.leavingSite` + an inline link `discover.questionCta` → `/contact`;
   - without `paymentUrl`: a `primary` button `discover.contactCta` → `/contact`, and no leaving-site note;
   - on mobile it sits under the photo, with the prices as two figure + label pairs.
2. **How it goes:** `Section` eyebrow `discover.stepsKicker`, `h2` `discover.stepsTitle`, and an `<ol>` of 4 steps (`grid lg:grid-cols-4 gap-8`). Each step is `pt-5 border-t-2 border-azur` with a number "01" (eyebrow style), an `h3` (`text-h4`) and a text (`discover.step1Title…step4Text`).

   **Mobile:** a vertical list with 32 px round number badges (`bg-azur text-white`; the last one is `bg-balise`).
3. **Good to know:** a `FlightTrace` frame (`min-h-80 rounded-md`, seed `"decouvrir"`) left, and right: eyebrow `discover.practicalKicker`, `h2` `discover.practicalTitle`, then a `<dl>` in 2 columns:
   - `dt` in `font-semibold text-azur`, `dd` in `text-texte`;
   - items: Âge, Poids, Durée, Météo from the new optional fields (render each only when filled); Tenue (static `discover.practicalClothesText`); Accès (`settings.address` first line + `TextLink` `discover.practicalMap` → `/contact#plan`).

   **Mobile:** accordions (`<details>`, 56 px summaries, `border-horizon`), the first one open.
4. **Vouchers:** `Section band id="bons"`, eyebrow `discover.vouchersKicker`, `h2` `discover.vouchersTitle`, sub `discover.bookingText` (existing). Two `bg-blanc rounded-md p-9` cards, each with a 28 px lucide icon (`Gift`, `Briefcase`), an `h3`, a text and an action:
   - individual: `secondary` "Acheter un bon" → `voucherUrl` ?? `paymentUrl` ?? `/contact`;
   - company: a `TextLink` "Demander un devis" → `/contact`.
5. **Next:** `h2` `discover.nextTitle`, text `discover.nextText`, `secondary` "Apprendre à voler" → `/club#formation`, and a `TextLink` "Les forfaits" → `/adherer`.
6. **Mobile only — sticky booking bar:**
   - `fixed inset-x-0 bottom-0 bg-blanc/96 shadow-[0_-8px_24px_-12px_rgb(11_26_42/0.22)] px-5 py-3 pb-[max(12px,env(safe-area-inset-bottom))]`;
   - left: price + under-18 price; right: a `primary` "Réserver";
   - it hides while the hero price panel is in view (`useInView`). Add `pb-20` to the page so the footer is not covered.

### Le club (`club/page.tsx`) — `Club.html`, `ClubMobile.html`

Keep the data flow (`SECTION_ORDER`, `CLUB_ANCHORS`, `allClubPagesQuery`, `clubHistoryQuery`) and the existing empty state.

1. **`PageHero`:** eyebrow `club.heroKicker`, `h1` `club.heroTitle`, Lead = `siteSettings.tagline` ?? `club.heroLead`. Photo = the **presentation** section's `mainImage` (so that section shows the facts panel instead of a photo).
2. **`SectionNav`:** one link per rendered section + history, with labels from `nav.*`.
3. **Sections:** each has an eyebrow = its two-digit index among the rendered sections, `h2` = the section `title`, Lead = `intro`, and `PortableText` body. Layout by section:

   | Section | Layout |
   |---|---|
   | `presentation` | Text (`flex-[999_1_560px]`) + "Le club en bref" panel (`bg-ciel rounded-md p-8`, `dl`): Terrain (`settings.address` first line), Flotte (`glidersCount` + `club.factsFleetText`), Membres (`membersCount`), and a `TextLink` `club.factsSeeFleet` → `/planeurs`. Rows with no data hide. |
   | `platform` | Existing `Map` (4:3, `rounded-md`; give the Leaflet container the radius and `overflow-hidden`) left, text right; address block + `TextLink` `club.itinerary` (an OpenStreetMap directions link from the coordinates). |
   | `activities` | Text left, `mainImage` / `FlightTrace` right (4:3). |
   | `training` | `Section band`, then `TrainingPath` below the text, then a `secondary` "Faire un premier vol" → `/decouvrir`. |
   | `campaign`, `competition` | Rendered together as a 2-column grid when both exist (`grid lg:grid-cols-2 gap-x-8 gap-y-16`). Each has a 3:2 photo or trace, then eyebrow + `h2` (`text-[2rem]`) + body. Competition adds the WeGlide `TextLink` (`stories.clubOnWeglide`) when `settings.weglideUrl` is set. |

4. **History (long read):**
   - an `article` with `pt-40 pb-32`;
   - a centred header (`max-w-[760px]`): eyebrow "07 · {nav.history}", `h2` in display size (`text-[2.375rem] lg:text-[4rem]`), intro as a centred Lead (`text-[1.375rem]`);
   - then `PortableText` in `.prose-piv` with `max-w-[680px] mx-auto mt-16`; the intro's drop cap moves to the first body paragraph (`first-letter:` in `font-display text-azur`);
   - anecdote callouts; a "Haut de page" `TextLink` (`ArrowUp`) at the end.
   - **Mobile:** body at 17 px, and figures go full-bleed (`-mx-5`).

### Other pages (Step 7)

All of them use `PageHero`, `Section`, `Container`, the footer and the empty states above.

| Route | Build it from |
|---|---|
| `/planeurs` | `PageHero`, then a grid of glider cards (`lg:grid-cols-3 md:grid-cols-2`): photo 4:3 or `FlightTrace` with `callsign`; category eyebrow (`gliders.categories.*`); `h3` name; a meta row (seats, wingspan, glide ratio, `tabular-nums`, `text-sm`). The detail (description, specs) opens in a `<details>` or a panel styled like the price table rows. |
| `/adherer` | `Section` "Les forfaits": `PriceTable` for `forfait-20h` and `forfait-illimite` × `under25`/`over25`. `Section` "Se former au pilotage": `PriceTable` (or the compact pack card from `Composants.html`) for the training packs. "Comment s'inscrire": `joinText` in `.prose-piv`, or `EmptyState` with `join.howEmpty`. A closing band like Venez essayer's "Next", with `join.tryCta` → `/decouvrir` and `join.contactCta`. |
| `/actualites` | Two columns on `lg`: `NewsRow` list (8 cols) + agenda (4 cols, `sticky top-28`). Stacked on mobile, agenda after news. Anchors `#news` and `#agenda` are kept. |
| `/actualites/[slug]` | The History long-read pattern: centred header with date, `Tag`, `h1`, excerpt as Lead; featured photo `max-w-[1040px] rounded-md`; `.prose-piv` body; `ShareButtons` restyled as 44 px icon buttons + "Copier le lien" `secondary` small. |
| `/recits` | Wide cards: 16:9 photo, or `FlightTrace` seeded by the title (the trace is the natural default here). Flight date + aircraft as meta, `h3`, excerpt, `TextLink` `stories.read`, external `TextLink` `stories.weglide`. The opened story reuses the long-read styles. Top `action` link `stories.clubOnWeglide`. |
| `/galerie` | Masonry columns (`columns-2 lg:columns-3 gap-4`, items `mb-4 rounded-md overflow-hidden`). Lightbox (yet-another-react-lightbox): background `rgb(11 26 42 / 0.94)`, 44 px controls, Escape to close. |
| `/webcam` | A 16:9 image in a `rounded-md` frame; below it, `webcam.refresh` · `webcam.lastUpdate` in `text-brume` and a `secondary` `webcam.open`. `EmptyState` when `webcamUrl` is empty. |
| `/liens` | 4 groups as columns (`lg:grid-cols-4 md:grid-cols-2`). Each link is a 56 px row: label (`font-semibold text-azur`), domain (`text-sm text-brume`), and an `ArrowUpRight` icon, with an `border-b border-horizon` divider. |
| `/contact` | Form left (labels above, fields `h-12 rounded-sm border border-brume/50 focus:border-altitude`, textarea `min-h-40`, errors in text under the field with `aria-describedby`, submit `primary`); right: address panel `bg-ciel rounded-md`. Below: the `Map` (`id="plan"`, `rounded-md`). |
| `not-found`, `error`, `loading` | The `EmptyState` frame with the existing strings; `loading` shows the same frame with the trace and no text. |

---

## Reference › Strings to add

Add every key to both files. Keys that already exist (`discover.bookingCta`, `home.cardTryTitle`…) are reused as-is and are not listed here.

| Key | fr | en |
|---|---|---|
| `nav.discoverShort` | Essayer | Try it |
| `nav.close` | Fermer | Close |
| `nav.groupFly` | Voler | Fly |
| `nav.groupClub` | Le club | The club |
| `nav.groupNews` | Actualités | News |
| `nav.groupPractical` | Pratique | Practical |
| `common.writeUs` | Nous écrire | Write to us |
| `common.backToTop` | Haut de page | Back to top |
| `common.languageFr` | Français | Français |
| `common.languageEn` | English | English |
| `home.heroKicker` | Vol à voile · Saint-Sulpice-des-Landes | Gliding · Saint-Sulpice-des-Landes |
| `home.heroCta` | Réserver un vol d’initiation | Book a trial flight |
| `home.heroPrice` | {adult} € · {young} € moins de 18 ans | €{adult} · €{young} under 18 |
| `home.slideCounter` | Photo {n} sur {total} | Photo {n} of {total} |
| `home.slidePause` | Mettre le diaporama en pause | Pause the slideshow |
| `home.slidePlay` | Relancer le diaporama | Play the slideshow |
| `home.slidePrev` | Photo précédente | Previous photo |
| `home.slideNext` | Photo suivante | Next photo |
| `home.startKicker` | Par où commencer | Where to start |
| `home.startTitle` | Du premier vol au premier brevet | From first flight to first licence |
| `home.cardTryPrice` | {adult} €, ou {young} € pour les moins de 18 ans. | €{adult}, or €{young} for under-18s. |
| `home.cardTryCta` | Réserver un vol | Book a flight |
| `home.cardLearnCta` | La formation | Training |
| `home.cardJoinCta` | Voir les forfaits | See the packages |
| `home.giftKicker` | Bons de vol | Flight vouchers |
| `home.giftTitle` | Offrez le ciel | Give the sky |
| `home.giftText` | Un anniversaire, un départ, un séminaire d’équipe : des bons de vol sont disponibles pour les particuliers comme pour les entreprises. | A birthday, a farewell, a team day: flight vouchers are available for individuals and companies. |
| `home.giftCta` | Offrir un vol | Give a flight |
| `home.giftCompanyCta` | Offre entreprises | For companies |
| `home.membersTitle` | Sur le terrain aujourd’hui | At the airfield today |
| `home.webcamLive` | en direct | live |
| `discover.leavingSite` | Vous quittez planeur35.org pour la page de paiement du club. | You will leave planeur35.org for the club’s payment page. |
| `discover.stepsKicker` | Le vol | The flight |
| `discover.stepsTitle` | Comment se passe votre premier vol | How your first flight goes |
| `discover.step1Title` | Accueil et briefing | Welcome and briefing |
| `discover.step1Text` | L’instructeur vous présente le planeur, les commandes et le déroulement du vol. Vous vous installez à l’avant. | The instructor shows you the glider, the controls and how the flight will go. You sit in the front seat. |
| `discover.step2Title` | Le décollage | Take-off |
| `discover.step2Text` | Le planeur est lancé jusqu’en altitude, puis se libère. À partir de là, plus de moteur : seulement le vent et le silence. | The glider is launched to height, then releases. From there, no engine: just the wind and the silence. |
| `discover.step3Title` | Vous prenez les commandes | You take the controls |
| `discover.step3Text` | Quand vous êtes prêt, l’instructeur vous laisse le manche. Il garde la main depuis la place arrière. | When you are ready, the instructor hands you the stick, staying in control from the back seat. |
| `discover.step4Title` | Atterrissage et débriefing | Landing and debrief |
| `discover.step4Text` | Retour au sol, quelques mots sur le vol, et toutes vos questions sur la suite. | Back on the ground, a few words about the flight, and all your questions about what comes next. |
| `discover.practicalKicker` | Avant de venir | Before you come |
| `discover.practicalTitle` | Bon à savoir | Good to know |
| `discover.practicalAge` | Âge | Age |
| `discover.practicalWeight` | Poids | Weight |
| `discover.practicalDuration` | Durée | Duration |
| `discover.practicalWeather` | Météo | Weather |
| `discover.practicalClothes` | Tenue | What to wear |
| `discover.practicalClothesText` | Des vêtements confortables, des chaussures fermées, une casquette et des lunettes de soleil. | Comfortable clothes, closed shoes, a cap and sunglasses. |
| `discover.practicalAccess` | Accès | Getting here |
| `discover.practicalMap` | Plan d’accès | Map and directions |
| `discover.vouchersKicker` | Bons de vol | Flight vouchers |
| `discover.vouchersTitle` | Un vol à offrir | A flight to give |
| `discover.voucherPersonTitle` | Pour un proche | For someone close |
| `discover.voucherPersonText` | Un bon nominatif à offrir pour un anniversaire ou une fête. | A named voucher to give for a birthday or a celebration. |
| `discover.voucherPersonCta` | Acheter un bon | Buy a voucher |
| `discover.voucherCompanyTitle` | Pour une entreprise | For a company |
| `discover.voucherCompanyText` | Cadeaux clients, comité d’entreprise, journée d’équipe : plusieurs bons ou une journée au terrain, sur devis. | Client gifts, staff committees, team days: several vouchers or a day at the airfield, on quotation. |
| `discover.voucherCompanyCta` | Demander un devis | Ask for a quote |
| `discover.nextTitle` | Et après le premier vol ? | After the first flight? |
| `discover.nextText` | Découvrez comment se passe la formation au club, du premier vol jusqu’aux badges, et les forfaits pour voler toute la saison. | See how training works at the club, from the first flight to the badges, and the packages to fly all season. |
| `discover.nextLearnCta` | Apprendre à voler | Learn to fly |
| `discover.nextJoinCta` | Les forfaits | Packages |
| `discover.stickyCta` | Réserver | Book |
| `club.heroLead` | Club de vol à voile en Bretagne, sur l’aérodrome de Saint-Sulpice-des-Landes. | Gliding club in Brittany, at Saint-Sulpice-des-Landes airfield. |
| `club.sectionNav` | Sections de la page | Page sections |
| `club.factsTitle` | Le club en bref | The club at a glance |
| `club.factsField` | Terrain | Airfield |
| `club.factsFleet` | Flotte | Fleet |
| `club.factsFleetText` | {count} planeurs, des biplaces école aux monoplaces de performance | {count} gliders, from two-seat trainers to performance single-seaters |
| `club.factsMembers` | Membres | Members |
| `club.factsSeeFleet` | Voir la flotte | See the fleet |
| `club.itinerary` | Itinéraire | Directions |
| `club.trainingCta` | Faire un premier vol | Take a first flight |
| `club.pathTitle` | Le cursus, étape par étape | The training path, step by step |
| `club.pathStepLabel` | Étape {n} | Step {n} |
| `club.pathNext` | Et ensuite | And then |
| `club.pathStep1Title` | Vol d’initiation | Trial flight |
| `club.pathStep1Text` | Un premier vol en biplace avec un instructeur. | A first flight in a two-seater with an instructor. |
| `club.pathStep2Title` | Vols en double | Dual flights |
| `club.pathStep2Text` | Décollage, virages, approche et atterrissage, avec l’instructeur. | Take-off, turns, approach and landing, with the instructor. |
| `club.pathStep3Title` | Le lâcher | First solo |
| `club.pathStep3Text` | Votre premier vol seul à bord. | Your first flight alone on board. |
| `club.pathStep4Title` | La licence | The licence |
| `club.pathStep4Text` | Théorie et examen pratique : la licence de pilote de planeur (SPL). | Theory and a flight test: the sailplane pilot licence (SPL). |
| `club.pathStep5Title` | Campagne et badges | Cross-country and badges |
| `club.pathStep5Text` | Les vols de distance, et les badges d’argent, d’or et diamants. | Distance flights, and the silver, gold and diamond badges. |
| `pricing.onRequest` | Sur demande | On request |
| `news.readMore` | Lire la suite | Read more |

`home.heroPrice`, `home.cardTryPrice` and the price panel take numbers from the `vol-initiation` tariffs. Format them with the existing `pricing.amount` pattern, or `Intl.NumberFormat` for the locale. Never hardcode 170 or 130.

## Reference › Sanity changes (all additive and optional)

Follow the content-model order in `AGENTS.md`: schema, then `types.ts`, then queries, then the page. Labels and descriptions are in French. Each field is optional, and the page renders without it.

| Field (on `siteSettings`) | Type | Group | Used by |
|---|---|---|---|
| `homeCardImages` | object `{ try, learn, join }` of `photoField` | Page d'accueil | Home entry cards |
| `giftImage` | `photoField` | Page d'accueil | Home gift band |
| `discoveryImage` | `photoField` | Textes des pages | Venez essayer hero |
| `discoveryAge`, `discoveryWeight`, `discoveryDuration`, `discoveryWeather` | `localizedText` (rows 2, max 200) | Textes des pages | "Bon à savoir" items |
| `voucherUrl` | `url` | Contact et réseaux | Individual voucher button |

Studio help text for `heroSlides`: "Photo d'au moins 2400 px de large. Le titre (70 caractères max.) s'affiche en très grand au-dessus de la photo."

Add nothing else, and rename or remove nothing.

## Reference › Assets

- **Logo:** `public/logo-icon.png` (header, footer). The full `logo.png` is no longer used in the UI; keep it for Open Graph.
- **Photos:** all from Sanity through `SanityPhoto` / `urlFor`. The mockups used `public/images/fleet/*` as stand-ins only: never import them in pages.
- **Hero slide photos** must be at least 2400 px wide. The only in-flight photo available today (`asg29.png`) is 878 px wide and will look soft (open question).
- **Icons:** `lucide-react` (already installed), 18–22 px, `stroke-width` 1.8–2. No emoji.

## Open questions for the club

Do not invent answers. Ship each block in its hidden or empty state until the data exists, and mention it in the pull request.

1. Key figures: member count, flight hours and founding year (Studio › Réglages du site › Chiffres clés).
2. Trial flight: minimum age, parental consent, maximum weight, flight duration, and the bad-weather policy.
3. Vouchers: validity, format, and whether a separate purchase link exists (`voucherUrl`).
4. Membership and training prices (`tariff` documents).
5. Training path wording: to be checked by an instructor (launch method, the club's actual steps).
6. Hero photos: at least 2400 px wide, ideally in flight and near the coast.
7. Le club section texts and the history: still empty drafts in the Studio.
8. Legal notice page and WeGlide club ID (existing known issues).
