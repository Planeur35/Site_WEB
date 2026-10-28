import { createClient } from '@sanity/client';

const token = process.env.SANITY_WRITE_TOKEN || process.argv.find(a => a.startsWith('--token='))?.split('=')[1];
if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN. Usage: SANITY_WRITE_TOKEN=sk... npx tsx scripts/seed-fleet.ts');
  process.exit(1);
}

const client = createClient({
  projectId: '8mup540n',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const fleet = [
  {
    _type: 'aircraft',
    name: 'DG 500 Trainer "LE"',
    registration: 'F-CILE',
    callsign: 'LE',
    category: 'biplace-ecole',
    manufacturer: 'DG Flugzeugbau',
    specs: { wingspan: '18-20 m', glideRatio: '35-40', seats: 2 },
    description: {
      fr: "Biplace spacieux et robuste pour la formation début, la formation campagne et le vol à deux.",
      en: 'Spacious and robust two-seater for beginner training, cross-country training, and two-person flights.',
    },
    sortOrder: 1,
  },
  {
    _type: 'aircraft',
    name: 'DG 500 Trainer "LG"',
    registration: 'F-CILG',
    callsign: 'LG',
    category: 'biplace-ecole',
    manufacturer: 'DG Flugzeugbau',
    specs: { wingspan: '18-20 m', glideRatio: '35-40', seats: 2 },
    description: {
      fr: "Biplace spacieux et robuste pour la formation début, la formation campagne et le vol à deux.",
      en: 'Spacious and robust two-seater for beginner training, cross-country training, and two-person flights.',
    },
    sortOrder: 2,
  },
  {
    _type: 'aircraft',
    name: 'ASK 21 Handiplaneur',
    registration: 'F-CLOL',
    callsign: '',
    category: 'handiplaneur',
    manufacturer: 'Alexander Schleicher',
    specs: { wingspan: '17 m', glideRatio: '34', seats: 2 },
    description: {
      fr: "Planeur biplace régional équipé de commandes adaptées permettant aux personnes à mobilité réduite de pratiquer le vol à voile.",
      en: 'Regional two-seat glider with adapted controls enabling people with reduced mobility to practise soaring.',
    },
    sortOrder: 1,
  },
  {
    _type: 'aircraft',
    name: 'Duo Discus "B4"',
    registration: 'F-CJCP',
    callsign: 'B4',
    category: 'biplace-perf',
    manufacturer: 'Schempp-Hirth',
    specs: { wingspan: '20 m', glideRatio: '44', seats: 2, maxWeight: '700 kg', year: 1999 },
    instrumentation: 'S100',
    description: {
      fr: "Biplace hautes performances et compétition. Excellent pour le vol de distance à deux.",
      en: 'High-performance competition two-seater. Excellent for two-person distance flying.',
    },
    sortOrder: 1,
  },
  {
    _type: 'aircraft',
    name: 'Astir Standard',
    registration: 'F-CEXT',
    callsign: 'R38',
    category: 'monoplace-debut',
    manufacturer: 'Grob',
    specs: { wingspan: '15 m', glideRatio: '38', seats: 1 },
    description: {
      fr: "Monoplace d'entrée, utilisé pour la progression après l'autorisation de vol solo.",
      en: 'Entry-level single-seater, used for progression after solo flight authorisation.',
    },
    sortOrder: 1,
  },
  {
    _type: 'aircraft',
    name: 'Pégase "D"',
    registration: 'F-CGHQ',
    callsign: 'D',
    category: 'monoplace-perf',
    manufacturer: 'Centrair',
    specs: { wingspan: '15 m', glideRatio: '40', seats: 1 },
    description: {
      fr: "Monoplace de progression pour le vol sur la campagne.",
      en: 'Single-seater for cross-country progression.',
    },
    sortOrder: 1,
  },
  {
    _type: 'aircraft',
    name: 'Pégase "BS"',
    registration: 'F-CGBD',
    callsign: 'BS',
    category: 'monoplace-perf',
    manufacturer: 'Centrair',
    specs: { wingspan: '15 m', glideRatio: '40', seats: 1 },
    description: {
      fr: "Monoplace de progression pour le vol sur la campagne.",
      en: 'Single-seater for cross-country progression.',
    },
    sortOrder: 2,
  },
  {
    _type: 'aircraft',
    name: 'Pégase "E529"',
    registration: 'F-CDVV',
    callsign: 'E529',
    category: 'monoplace-perf',
    manufacturer: 'Centrair',
    specs: { wingspan: '15 m', glideRatio: '40', seats: 1 },
    description: {
      fr: "Monoplace de progression pour le vol sur la campagne.",
      en: 'Single-seater for cross-country progression.',
    },
    sortOrder: 3,
  },
  {
    _type: 'aircraft',
    name: 'Discus B "D16"',
    registration: 'F-CGGQ',
    callsign: 'D16',
    category: 'monoplace-perf',
    manufacturer: 'Schempp-Hirth',
    specs: { wingspan: '15 m', glideRatio: '43', seats: 1, maxWeight: '525 kg', year: 1991 },
    instrumentation: 'S100',
    description: {
      fr: "Hautes performances et compétition.",
      en: 'High performance and competition.',
    },
    sortOrder: 4,
  },
  {
    _type: 'aircraft',
    name: 'ASW 24 "CQ"',
    registration: 'F-CGKN',
    callsign: 'CQ',
    category: 'monoplace-perf',
    manufacturer: 'Alexander Schleicher',
    specs: { wingspan: '15 m', glideRatio: '44', seats: 1, maxWeight: '500 kg', year: 1990 },
    instrumentation: 'VP4',
    description: {
      fr: "Hautes performances et compétition.",
      en: 'High performance and competition.',
    },
    sortOrder: 5,
  },
  {
    _type: 'aircraft',
    name: 'LS 7-WL NEO "AK"',
    registration: 'F-CAKS',
    callsign: 'AK',
    category: 'monoplace-perf',
    manufacturer: 'Rolladen-Schneider',
    specs: { wingspan: '15 m', glideRatio: '43', seats: 1, maxWeight: '486 kg', year: 1990 },
    instrumentation: 'LX9000, transponder',
    description: {
      fr: "Hautes performances et compétition.",
      en: 'High performance and competition.',
    },
    sortOrder: 6,
  },
  {
    _type: 'aircraft',
    name: 'ASW 28 "KM"',
    registration: 'D-9877',
    callsign: 'KM',
    category: 'monoplace-perf',
    manufacturer: 'Alexander Schleicher',
    specs: { wingspan: '15 m', glideRatio: '45', seats: 1, maxWeight: '525 kg', year: 2007 },
    instrumentation: 'S100',
    description: {
      fr: "Hautes performances et compétition.",
      en: 'High performance and competition.',
    },
    sortOrder: 7,
  },
  {
    _type: 'aircraft',
    name: 'ASG 29 "V"',
    registration: 'D-2729',
    callsign: 'V',
    category: 'monoplace-perf',
    manufacturer: 'Alexander Schleicher',
    specs: { wingspan: '15/18 m', glideRatio: '45/52', seats: 1, maxWeight: '600 kg', year: 2006 },
    instrumentation: 'LX9000',
    description: {
      fr: "Très hautes performances et compétition. Envergure variable 15 m ou 18 m.",
      en: 'Very high performance and competition. Variable wingspan 15 m or 18 m.',
    },
    sortOrder: 8,
  },
];

async function main() {
  console.log('=== PIV Fleet Seed ===\n');

  // Delete existing aircraft
  console.log('Deleting old aircraft...');
  const existing = await client.fetch<{ _id: string }[]>('*[_type == "aircraft"]{ _id }');
  for (const doc of existing) {
    await client.delete(doc._id);
  }
  console.log(`  Deleted ${existing.length} old aircraft.\n`);

  // Create new aircraft
  console.log(`Creating ${fleet.length} aircraft...`);
  for (const ac of fleet) {
    try {
      await client.create(ac);
      console.log(`  OK: ${ac.name}`);
    } catch (err: unknown) {
      console.error(`  FAILED: ${ac.name}`, err instanceof Error ? err.message : err);
    }
  }

  console.log('\nDone.');
}

main();
