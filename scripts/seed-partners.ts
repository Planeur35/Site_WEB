import { createClient } from '@sanity/client';

/**
 * Creates the partners of the association as drafts, without logos.
 * Open each one in the Studio (Partenaires) to add its logo, then publish.
 * Safe to re-run: a partner that already exists (same name) is kept.
 *
 * Usage: SANITY_WRITE_TOKEN=sk... npx tsx scripts/seed-partners.ts
 */

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN. Usage: SANITY_WRITE_TOKEN=sk... npx tsx scripts/seed-partners.ts');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '8mup540n',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const partners = [
  'Fédération Française de Vol en Planeur',
  'Comité Régional de Vol en Planeur',
  'Sport Handicaps Bretagne',
  'Comité départemental olympique et sportif',
  'Région Bretagne',
  'Département d’Ille-et-Vilaine',
  'Bretagne porte de Loire communauté',
  'Mairie de Saint-Sulpice des Landes',
  'Ministère des Sports',
];

async function main() {
  const tx = client.transaction();

  for (const [index, name] of partners.entries()) {
    const existing = await client.fetch<number>('count(*[_type == "partner" && name == $name])', { name });
    if (existing > 0) {
      console.log(`- ${name} : existe déjà, ignoré`);
      continue;
    }
    tx.createIfNotExists({
      _id: `drafts.partner-${index + 1}`,
      _type: 'partner',
      name,
      sortOrder: (index + 1) * 10,
    });
    console.log(`+ ${name}`);
  }

  await tx.commit();
  console.log('Terminé. Ouvrez « Partenaires » dans le Studio pour ajouter les logos, puis publiez.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
