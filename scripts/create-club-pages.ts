import { createClient } from '@sanity/client';

/**
 * Creates empty drafts for the "Le club" page: one clubPage per section, plus
 * the clubHistory singleton. Drafts show in the Studio but not on the site
 * until someone clicks Publish. Safe to re-run: existing documents are kept.
 *
 * Usage: SANITY_WRITE_TOKEN=sk... npx tsx scripts/create-club-pages.ts
 */

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN. Usage: SANITY_WRITE_TOKEN=sk... npx tsx scripts/create-club-pages.ts');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '8mup540n',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const sections = [
  { section: 'presentation', fr: 'Présentation de l’association', en: 'About the association' },
  { section: 'platform', fr: 'La plateforme', en: 'The airfield' },
  { section: 'activities', fr: 'Activité des membres', en: 'Members’ life' },
  { section: 'training', fr: 'Formation initiale', en: 'Pilot training' },
  { section: 'campaign', fr: 'Perfectionnement', en: 'Advanced training' },
  { section: 'competition', fr: 'Compétition', en: 'Competition' },
];

async function main() {
  const tx = client.transaction();

  for (const { section, fr, en } of sections) {
    const existing = await client.fetch<number>(
      'count(*[_type == "clubPage" && section == $section])',
      { section },
    );
    if (existing > 0) {
      console.log(`- ${fr} : existe déjà, ignorée`);
      continue;
    }
    tx.createIfNotExists({
      _id: `drafts.clubPage-${section}`,
      _type: 'clubPage',
      section,
      title: { fr, en },
    });
    console.log(`+ ${fr}`);
  }

  const history = await client.fetch<number>('count(*[_id in ["clubHistory", "drafts.clubHistory"]])');
  if (history > 0) {
    console.log('- Histoire de l’association : existe déjà, ignorée');
  } else {
    tx.createIfNotExists({
      _id: 'drafts.clubHistory',
      _type: 'clubHistory',
      title: { fr: 'Histoire de l’association', en: 'Association history' },
    });
    console.log('+ Histoire de l’association');
  }

  await tx.commit();
  console.log('Brouillons créés. Ouvrez /studio → Pages de l’association pour les remplir, puis Publish.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
