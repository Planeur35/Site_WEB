# Planeur35.org Website Redesign — Design Spec

## Context

The Planeurs d'Ille-et-Vilaine (PIV) glider club needs a modern website to replace the current Joomla-based site at planeur35.org. The current site has an outdated design, poor mobile support, and cluttered navigation. The primary goal of the new site is to **attract new members** by showcasing the club, discovery flights, and the soaring experience. Content will be managed by **non-technical club volunteers**.

## Tech Stack

- **Frontend:** Next.js 15 (App Router) with TypeScript
- **CMS:** Sanity v3 (hosted) — real-time collaborative editing, media management
- **Styling:** Tailwind CSS 4
- **i18n:** `next-intl` for routing + Sanity document-level translations
- **Deployment:** Vercel free tier
- **Contact form email:** Resend API (free tier)
- **Map:** Leaflet.js + OpenStreetMap
- **Images:** Sanity image pipeline (CDN, auto-resize, WebP)

## Language

Bilingual: **French** (primary) + **English**. URL structure: `/fr/...` and `/en/...` with French as default.

## Visual Design

- **Color palette:** Sky Blue theme
  - Primary: `#1e3a5f` (deep navy)
  - Accent: `#3b82f6` (sky blue)
  - Light background: `#f0f9ff`
  - Dark text: `#0f172a`
- **Typography:** Inter (or similar modern sans-serif) via Google Fonts
- **Layout:** Clean, spacious, mobile-first responsive design
- **Imagery:** Large, high-quality photos of gliders, landscapes, club life

## Site Structure

```
Home
├── Discover
│   ├── What is soaring?
│   ├── Discovery flights
│   └── Become a pilot
├── The Club
│   ├── About us
│   ├── Our fleet
│   ├── The aerodrome
│   └── Pricing
├── Gallery
├── News (blog)
│   └── [Article page]
├── Live
│   ├── Webcam
│   └── WeGlide
└── Contact
```

## Homepage Layout

Full-width hero + cards layout:
1. **Hero section:** Full-width background image with overlay text, club tagline, and prominent "Discovery flight" CTA button
2. **Highlight cards:** 3 cards below the hero — Discovery flights, Training, Fleet — each linking to the relevant section
3. **Gallery preview + Latest news:** 2-column grid showing recent photos and news articles
4. **Footer:** Contact info, social links, quick nav links, language toggle

## Navigation

- **Sticky header** with logo, main nav items, language toggle (FR | EN), and CTA button ("Vol découverte")
- **Dropdown menus** for "Discover" and "The Club" sections
- **Mobile:** Hamburger menu with slide-out navigation panel
- **Footer:** Full sitemap links, contact info, social media icons

## Pages Detail

### Home
Hero image + tagline + CTA. Three highlight cards (Discovery, Training, Fleet). Gallery preview grid. Latest 3 news articles. Club stats (optional).

### Discover > What is Soaring?
Intro text explaining gliding for beginners. Embedded video (YouTube/Vimeo). Photo illustrations. CTA to book a discovery flight.

### Discover > Discovery Flights
What to expect, duration, pricing. Photo of tandem flight. CTA to contact form.

### Discover > Become a Pilot
Training path overview. Licensing requirements. Costs and timeline. CTA to contact form.

### The Club > About Us
Club history, values, team. Photos of the club life.

### The Club > Our Fleet
Grid of aircraft cards. Each card: photo, name, type (training/performance), key specs. Click to expand for more details.

### The Club > The Aerodrome
Location info with Leaflet map. Facilities description. Access directions. Photos.

### The Club > Pricing
Membership tiers and costs. Flight costs. Discovery flight pricing. Table format.

### Gallery
Responsive photo grid (1/2/3 columns by breakpoint). Lightbox for full-size view. Optional category/tag filtering. Video embeds.

### News
Blog listing with cards: featured image, title, date, excerpt. Category filtering. Pagination.

### News > Article
Full article with rich text, images, author, date, category. Share buttons. Related articles.

### Live > Webcam
Embedded webcam iframe/image with auto-refresh. Brief description of the aerodrome view.

### Live > WeGlide
Embedded iframe or link to club's WeGlide page showing recent flights.

### Contact
Contact form (name, email, subject, message) → sends email via Resend. Phone number and email address displayed prominently. Leaflet map with aerodrome pin. Operating hours.

## Sanity Content Model

### Document Types

**`siteSettings`** (singleton)
- `clubName`: string
- `tagline`: localized string (fr/en)
- `contactEmail`: string
- `contactPhone`: string
- `address`: text
- `socialLinks`: array of { platform, url }
- `webcamUrl`: url
- `weglideUrl`: url
- `aerodromeCoordinates`: { lat, lng }

**`page`**
- `title`: localized string
- `slug`: slug
- `hero`: image with alt text
- `body`: localized portable text (rich text with images)
- `seo`: { metaTitle, metaDescription } localized

**`article`**
- `title`: localized string
- `slug`: slug
- `publishedAt`: datetime
- `author`: string
- `category`: reference to `category`
- `featuredImage`: image with alt text
- `excerpt`: localized text
- `body`: localized portable text
- `seo`: { metaTitle, metaDescription } localized

**`category`**
- `title`: localized string
- `slug`: slug

**`aircraft`**
- `name`: string
- `type`: string (training / performance / tandem)
- `photo`: image
- `specs`: object { wingspan, glideRatio, seats, year }
- `description`: localized portable text

**`galleryImage`**
- `image`: image with alt text
- `caption`: localized string
- `tags`: array of strings
- `date`: date

## Next.js Project Structure

```
src/
  app/
    [locale]/
      page.tsx                    # Homepage
      decouvrir/
        page.tsx                  # What is soaring?
        vols-decouverte/page.tsx  # Discovery flights
        devenir-pilote/page.tsx   # Become a pilot
      le-club/
        page.tsx                  # About us
        flotte/page.tsx           # Fleet
        aerodrome/page.tsx        # Aerodrome
        tarifs/page.tsx           # Pricing
      galerie/page.tsx            # Gallery
      actualites/
        page.tsx                  # News listing
        [slug]/page.tsx           # Article detail
      en-direct/
        page.tsx                  # Live overview
        webcam/page.tsx           # Webcam
        weglide/page.tsx          # WeGlide
      contact/page.tsx            # Contact
    studio/[[...tool]]/page.tsx   # Sanity Studio (admin)
  components/
    layout/
      Header.tsx
      Footer.tsx
      MobileMenu.tsx
      LanguageToggle.tsx
    ui/
      Button.tsx
      Card.tsx
      Hero.tsx
      ContactForm.tsx
      Map.tsx
      Gallery.tsx
      Lightbox.tsx
    sanity/
      PortableText.tsx            # Rich text renderer
  lib/
    sanity/
      client.ts                  # Sanity client config
      queries.ts                 # GROQ queries
      types.ts                   # TypeScript types from schema
    email.ts                     # Resend email helper
  messages/
    fr.json                      # French UI translations
    en.json                      # English UI translations
sanity/
  schemas/                       # Sanity schema definitions
  sanity.config.ts               # Sanity configuration
```

## Integrations

- **Webcam:** Iframe embed or `<img>` tag with auto-refresh from the existing webcam URL. URL is configurable in Sanity site settings.
- **WeGlide:** Link + optional iframe embed to the club's WeGlide page. URL configurable in Sanity.
- **Social media:** Footer icons linking to Facebook, Instagram, etc. URLs in Sanity site settings.
- **Contact form:** Server action → Resend API. Rate limited. Sends email to the club's contact address (from site settings).
- **Map:** Leaflet.js with OpenStreetMap tiles. Aerodrome coordinates from Sanity site settings.

## Admin Access

Sanity Studio is embedded at `/studio` in the Next.js app. Access is controlled by Sanity's authentication:
- Admin accounts created in the Sanity project dashboard
- Supports Google login and email/password
- Workspace-level access control (editor, viewer, admin roles)
- No public access — only invited team members can log in

## Responsive Design

- Mobile-first approach using Tailwind CSS breakpoints (`sm`, `md`, `lg`, `xl`)
- Hamburger menu on screens < `md`
- Hero: full image on all sizes, no video on mobile
- Gallery: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Fleet cards: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Touch-friendly tap targets (min 44px)

## Performance

- Static generation (SSG) for all pages except news (ISR with 60s revalidation)
- Sanity CDN for all images with automatic WebP conversion and responsive srcsets
- Lazy loading for below-the-fold images and gallery
- Target: Lighthouse > 90 on all metrics (Performance, Accessibility, Best Practices, SEO)

## SEO

- Semantic HTML throughout
- Open Graph and Twitter Card meta tags on all pages
- Structured data (Organization, BreadcrumbList)
- Sitemap.xml auto-generated
- Canonical URLs with hreflang tags for FR/EN
