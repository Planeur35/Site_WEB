/**
 * Seed script for Planeurs d'Ille-et-Vilaine Sanity CMS
 *
 * Populates the Sanity dataset with site settings, categories, aircraft, and sample articles.
 *
 * Prerequisites:
 *   npm install --save-dev tsx
 *   # or: npx tsx scripts/seed.ts
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<token> npx tsx scripts/seed.ts
 *   # or pass as CLI arg:
 *   npx tsx scripts/seed.ts --token=<token>
 */

import { createClient } from '@sanity/client';
import * as readline from 'readline';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const PROJECT_ID = '8mup540n';
const DATASET = 'production';
const API_VERSION = '2024-01-01';

function getToken(): string {
  const cliArg = process.argv.find((a) => a.startsWith('--token='));
  const token = cliArg ? cliArg.split('=')[1] : process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    console.error(
      'Error: No write token provided.\n' +
        'Set SANITY_WRITE_TOKEN env var or pass --token=<token> as CLI argument.',
    );
    process.exit(1);
  }
  return token;
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: getToken(),
  useCdn: false,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function block(text: string, blockKey: string, spanKey: string) {
  return {
    _type: 'block' as const,
    _key: blockKey,
    style: 'normal' as const,
    markDefs: [],
    children: [
      {
        _type: 'span' as const,
        _key: spanKey,
        text,
        marks: [],
      },
    ],
  };
}

function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// ---------------------------------------------------------------------------
// Category IDs (deterministic so articles can reference them)
// ---------------------------------------------------------------------------

const CATEGORY_IDS = {
  vieClub: 'category-vie-du-club',
  competition: 'category-competition',
  formation: 'category-formation',
} as const;

// ---------------------------------------------------------------------------
// 1. Site Settings
// ---------------------------------------------------------------------------

function siteSettingsDoc() {
  return {
    _id: 'siteSettings',
    _type: 'siteSettings',
    clubName: "Planeurs d'Ille-et-Vilaine",
    tagline: {
      fr: 'Club de vol a voile en Bretagne',
      en: 'Soaring club in Brittany',
    },
    contactEmail: 'contact@planeur35.org',
    contactPhone: '06 XX XX XX XX',
    address: 'Aerodrome de Saint-Sulpice-des-Landes, 35390 Saint-Sulpice-des-Landes',
    socialLinks: [
      {
        _key: 'fb',
        platform: 'facebook',
        url: 'https://www.facebook.com/PlaneursIlleetVilaine/',
      },
    ],
    // webcamUrl left empty for now (url type cannot be empty string, omit it)
    weglideUrl: 'https://www.weglide.org/club/271',
    aerodromeCoordinates: {
      lat: 47.885,
      lng: -1.688,
    },
  };
}

// ---------------------------------------------------------------------------
// 2. Categories
// ---------------------------------------------------------------------------

function categoryDocs() {
  return [
    {
      _id: CATEGORY_IDS.vieClub,
      _type: 'category',
      title: { fr: 'Vie du club', en: 'Club life' },
      slug: { _type: 'slug', current: 'vie-du-club' },
    },
    {
      _id: CATEGORY_IDS.competition,
      _type: 'category',
      title: { fr: 'Competition', en: 'Competition' },
      slug: { _type: 'slug', current: 'competition' },
    },
    {
      _id: CATEGORY_IDS.formation,
      _type: 'category',
      title: { fr: 'Formation', en: 'Training' },
      slug: { _type: 'slug', current: 'formation' },
    },
  ];
}

// ---------------------------------------------------------------------------
// 3. Aircraft
// ---------------------------------------------------------------------------

type FleetCategory =
  | 'biplace-ecole'
  | 'biplace-perf'
  | 'monoplace-debut'
  | 'monoplace-perf'
  | 'handiplaneur';

function mapCategory(cat: FleetCategory): 'training' | 'tandem' | 'performance' {
  switch (cat) {
    case 'biplace-ecole':
    case 'handiplaneur':
      return 'training';
    case 'biplace-perf':
      return 'tandem';
    case 'monoplace-debut':
    case 'monoplace-perf':
      return 'performance';
  }
}

interface FleetItem {
  id: string;
  name: string;
  category: FleetCategory;
  wingspan: string;
  glideRatio: string;
  seats: number;
  year?: string;
  descFr: string;
  descEn: string;
}

const fleet: FleetItem[] = [
  {
    id: 'dg500-le',
    name: 'DG 500 Trainer "LE"',
    category: 'biplace-ecole',
    wingspan: '18-20 m',
    glideRatio: '35-40',
    seats: 2,
    descFr: "Biplace spacieux et robuste pour la formation debut, la formation campagne et le vol a deux.",
    descEn: 'Spacious and robust two-seater for beginner training, cross-country training, and two-person flights.',
  },
  {
    id: 'dg500-lg',
    name: 'DG 500 Trainer "LG"',
    category: 'biplace-ecole',
    wingspan: '18-20 m',
    glideRatio: '35-40',
    seats: 2,
    descFr: "Biplace spacieux et robuste pour la formation debut, la formation campagne et le vol a deux.",
    descEn: 'Spacious and robust two-seater for beginner training, cross-country training, and two-person flights.',
  },
  {
    id: 'ask21-handi',
    name: 'ASK 21 Handiplaneur',
    category: 'handiplaneur',
    wingspan: '17 m',
    glideRatio: '34',
    seats: 2,
    descFr: "Planeur biplace regional equipe de commandes adaptees permettant aux personnes a mobilite reduite de pratiquer le vol a voile.",
    descEn: 'Regional two-seat glider with adapted controls enabling people with reduced mobility to practise soaring.',
  },
  {
    id: 'duo-discus',
    name: 'Duo Discus "B4"',
    category: 'biplace-perf',
    wingspan: '20 m',
    glideRatio: '44',
    seats: 2,
    year: '1999',
    descFr: "Biplace hautes performances et competition. Excellent pour le vol de distance a deux.",
    descEn: 'High-performance competition two-seater. Excellent for two-person distance flying.',
  },
  {
    id: 'astir',
    name: 'Astir Standard',
    category: 'monoplace-debut',
    wingspan: '15 m',
    glideRatio: '38',
    seats: 1,
    descFr: "Monoplace d'entree, utilise pour la progression apres l'autorisation de vol solo.",
    descEn: 'Entry-level single-seater, used for progression after solo flight authorisation.',
  },
  {
    id: 'pegase-d',
    name: 'Pegase "D"',
    category: 'monoplace-perf',
    wingspan: '15 m',
    glideRatio: '40',
    seats: 1,
    descFr: 'Monoplace de progression pour le vol sur la campagne.',
    descEn: 'Single-seater for cross-country progression.',
  },
  {
    id: 'pegase-bs',
    name: 'Pegase "BS"',
    category: 'monoplace-perf',
    wingspan: '15 m',
    glideRatio: '40',
    seats: 1,
    descFr: 'Monoplace de progression pour le vol sur la campagne.',
    descEn: 'Single-seater for cross-country progression.',
  },
  {
    id: 'pegase-e529',
    name: 'Pegase "E529"',
    category: 'monoplace-perf',
    wingspan: '15 m',
    glideRatio: '40',
    seats: 1,
    descFr: 'Monoplace de progression pour le vol sur la campagne.',
    descEn: 'Single-seater for cross-country progression.',
  },
  {
    id: 'discus-b',
    name: 'Discus B "D16"',
    category: 'monoplace-perf',
    wingspan: '15 m',
    glideRatio: '43',
    seats: 1,
    year: '1991',
    descFr: 'Hautes performances et competition.',
    descEn: 'High performance and competition.',
  },
  {
    id: 'asw24',
    name: 'ASW 24 "CQ"',
    category: 'monoplace-perf',
    wingspan: '15 m',
    glideRatio: '44',
    seats: 1,
    year: '1990',
    descFr: 'Hautes performances et competition.',
    descEn: 'High performance and competition.',
  },
  {
    id: 'ls7',
    name: 'LS 7-WL NEO "AK"',
    category: 'monoplace-perf',
    wingspan: '15 m',
    glideRatio: '43',
    seats: 1,
    year: '1990',
    descFr: 'Hautes performances et competition.',
    descEn: 'High performance and competition.',
  },
  {
    id: 'asw28',
    name: 'ASW 28 "KM"',
    category: 'monoplace-perf',
    wingspan: '15 m',
    glideRatio: '45',
    seats: 1,
    year: '2007',
    descFr: 'Hautes performances et competition.',
    descEn: 'High performance and competition.',
  },
  {
    id: 'asg29',
    name: 'ASG 29 "V"',
    category: 'monoplace-perf',
    wingspan: '15/18 m',
    glideRatio: '45/52',
    seats: 1,
    year: '2006',
    descFr: 'Tres hautes performances et competition. Envergure variable 15 m ou 18 m.',
    descEn: 'Very high performance and competition. Variable wingspan 15 m or 18 m.',
  },
];

function aircraftDocs() {
  return fleet.map((a, i) => {
    const yearNum = a.year ? parseInt(a.year, 10) : undefined;
    return {
      _type: 'aircraft',
      name: a.name,
      type: mapCategory(a.category),
      specs: {
        wingspan: a.wingspan,
        glideRatio: a.glideRatio,
        seats: a.seats,
        ...(yearNum ? { year: yearNum } : {}),
      },
      description: {
        fr: [block(a.descFr, `blk-fr-${i}`, `spn-fr-${i}`)],
        en: [block(a.descEn, `blk-en-${i}`, `spn-en-${i}`)],
      },
    };
  });
}

// ---------------------------------------------------------------------------
// 4. Sample Articles
// ---------------------------------------------------------------------------

function articleDocs() {
  return [
    {
      _type: 'article',
      title: {
        fr: 'Ouverture de la saison 2026',
        en: '2026 Season opening',
      },
      slug: { _type: 'slug', current: 'ouverture-de-la-saison-2026' },
      publishedAt: '2026-03-15T10:00:00Z',
      author: 'PIV',
      category: { _type: 'reference', _ref: CATEGORY_IDS.vieClub },
      excerpt: {
        fr: "La saison de vol a voile 2026 est officiellement ouverte ! Retrouvez-nous a l'aerodrome de Saint-Sulpice-des-Landes pour profiter des premieres ascendances de printemps.",
        en: 'The 2026 soaring season is officially open! Join us at the Saint-Sulpice-des-Landes aerodrome to enjoy the first spring thermals.',
      },
      body: {
        fr: [
          block(
            "La saison 2026 est lancee ! Apres les travaux de maintenance hivernale sur notre flotte, tous les planeurs sont prets a reprendre le ciel breton.",
            'art1-fr-blk1',
            'art1-fr-spn1',
          ),
          block(
            "Les inscriptions pour les nouveaux eleves sont ouvertes. Que vous soyez debutant ou pilote confirme, le club vous accueille tous les week-ends et jours feries a partir du mois de mars.",
            'art1-fr-blk2',
            'art1-fr-spn2',
          ),
          block(
            "N'hesitez pas a nous contacter pour planifier un vol decouverte ou pour vous renseigner sur nos formules de formation.",
            'art1-fr-blk3',
            'art1-fr-spn3',
          ),
        ],
        en: [
          block(
            'The 2026 season has started! After winter maintenance work on our fleet, all gliders are ready to take to the Breton skies again.',
            'art1-en-blk1',
            'art1-en-spn1',
          ),
          block(
            'Registrations for new students are open. Whether you are a beginner or an experienced pilot, the club welcomes you every weekend and public holiday from March onwards.',
            'art1-en-blk2',
            'art1-en-spn2',
          ),
          block(
            'Feel free to contact us to schedule a discovery flight or to learn about our training packages.',
            'art1-en-blk3',
            'art1-en-spn3',
          ),
        ],
      },
    },
    {
      _type: 'article',
      title: {
        fr: 'Resultats du championnat regional',
        en: 'Regional championship results',
      },
      slug: { _type: 'slug', current: 'resultats-du-championnat-regional' },
      publishedAt: '2026-03-10T14:00:00Z',
      author: 'PIV',
      category: { _type: 'reference', _ref: CATEGORY_IDS.competition },
      excerpt: {
        fr: "Nos pilotes ont brille lors du championnat regional de vol a voile. Decouvrez les resultats et les moments forts de cette edition.",
        en: 'Our pilots shone at the regional soaring championship. Discover the results and highlights of this edition.',
      },
      body: {
        fr: [
          block(
            "Le championnat regional de vol a voile s'est tenu la semaine derniere dans d'excellentes conditions meteo. Les pilotes du PIV ont represente le club avec brio.",
            'art2-fr-blk1',
            'art2-fr-spn1',
          ),
          block(
            "En classe standard, notre equipe a termine sur le podium avec une troisieme place, confirmant la progression constante de nos competiteurs. Le Discus B et l'ASW 28 ont ete particulierement performants.",
            'art2-fr-blk2',
            'art2-fr-spn2',
          ),
          block(
            "Felicitations a tous les participants ! Le prochain rendez-vous est le championnat inter-regional prevu en juin.",
            'art2-fr-blk3',
            'art2-fr-spn3',
          ),
        ],
        en: [
          block(
            'The regional soaring championship took place last week in excellent weather conditions. PIV pilots represented the club brilliantly.',
            'art2-en-blk1',
            'art2-en-spn1',
          ),
          block(
            'In standard class, our team finished on the podium with third place, confirming the steady progress of our competitors. The Discus B and ASW 28 performed particularly well.',
            'art2-en-blk2',
            'art2-en-spn2',
          ),
          block(
            'Congratulations to all participants! The next event is the inter-regional championship scheduled for June.',
            'art2-en-blk3',
            'art2-en-spn3',
          ),
        ],
      },
    },
    {
      _type: 'article',
      title: {
        fr: 'Nouveau pack formation disponible',
        en: 'New training package available',
      },
      slug: { _type: 'slug', current: 'nouveau-pack-formation-disponible' },
      publishedAt: '2026-03-05T09:00:00Z',
      author: 'PIV',
      category: { _type: 'reference', _ref: CATEGORY_IDS.formation },
      excerpt: {
        fr: "Le club propose un nouveau pack formation pour la saison 2026. Un tarif attractif pour decouvrir le vol a voile et progresser jusqu'au brevet.",
        en: 'The club offers a new training package for the 2026 season. An attractive rate to discover soaring and progress to your licence.',
      },
      body: {
        fr: [
          block(
            "Pour la saison 2026, le PIV lance un nouveau pack formation tout compris. Ce forfait inclut l'adhesion au club, les cours theoriques, et un nombre de vols en biplace avec instructeur.",
            'art3-fr-blk1',
            'art3-fr-spn1',
          ),
          block(
            "Le programme est concu pour amener les eleves du premier vol jusqu'au lacher solo, avec un accompagnement personnalise par nos instructeurs benevoles experimentes.",
            'art3-fr-blk2',
            'art3-fr-spn2',
          ),
          block(
            "Renseignements et inscriptions aupres du secretariat du club ou par email. Places limitees, ne tardez pas !",
            'art3-fr-blk3',
            'art3-fr-spn3',
          ),
        ],
        en: [
          block(
            'For the 2026 season, PIV is launching a new all-inclusive training package. This plan includes club membership, theory lessons, and a number of dual flights with an instructor.',
            'art3-en-blk1',
            'art3-en-spn1',
          ),
          block(
            'The programme is designed to take students from their first flight all the way to solo, with personalised support from our experienced volunteer instructors.',
            'art3-en-blk2',
            'art3-en-spn2',
          ),
          block(
            'Enquiries and registration at the club office or by email. Places are limited, so do not delay!',
            'art3-en-blk3',
            'art3-en-spn3',
          ),
        ],
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const settings = siteSettingsDoc();
  const categories = categoryDocs();
  const aircraft = aircraftDocs();
  const articles = articleDocs();

  console.log('=== PIV Sanity Seed Script ===');
  console.log(`Project:  ${PROJECT_ID}`);
  console.log(`Dataset:  ${DATASET}`);
  console.log('');
  console.log('Documents to create:');
  console.log(`  - 1 siteSettings (createOrReplace, _id: "siteSettings")`);
  console.log(`  - ${categories.length} categories (createOrReplace)`);
  console.log(`  - ${aircraft.length} aircraft (create)`);
  console.log(`  - ${articles.length} articles (create)`);
  console.log(`  Total: ${1 + categories.length + aircraft.length + articles.length} documents`);
  console.log('');

  const proceed = await confirm('Proceed? (y/N) ');
  if (!proceed) {
    console.log('Aborted.');
    process.exit(0);
  }

  console.log('');

  // --- Site Settings ---
  try {
    console.log('[1/4] Creating siteSettings...');
    await client.createOrReplace(settings);
    console.log('       OK: siteSettings created.');
  } catch (err: unknown) {
    console.error('       FAILED: siteSettings', err instanceof Error ? err.message : err);
  }

  // --- Categories ---
  console.log(`[2/4] Creating ${categories.length} categories...`);
  for (const cat of categories) {
    try {
      await client.createOrReplace(cat);
      console.log(`       OK: category "${cat.title.fr}"`);
    } catch (err: unknown) {
      console.error(`       FAILED: category "${cat.title.fr}"`, err instanceof Error ? err.message : err);
    }
  }

  // --- Aircraft ---
  console.log(`[3/4] Creating ${aircraft.length} aircraft...`);
  for (const ac of aircraft) {
    try {
      await client.create(ac);
      console.log(`       OK: aircraft "${ac.name}"`);
    } catch (err: unknown) {
      console.error(`       FAILED: aircraft "${ac.name}"`, err instanceof Error ? err.message : err);
    }
  }

  // --- Articles ---
  console.log(`[4/4] Creating ${articles.length} articles...`);
  for (const art of articles) {
    try {
      await client.create(art);
      console.log(`       OK: article "${art.title.fr}"`);
    } catch (err: unknown) {
      console.error(`       FAILED: article "${art.title.fr}"`, err instanceof Error ? err.message : err);
    }
  }

  console.log('');
  console.log('Seed complete.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
