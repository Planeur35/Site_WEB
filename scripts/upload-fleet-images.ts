import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { basename } from 'path';

const token = process.env.SANITY_WRITE_TOKEN || process.argv.find(a => a.startsWith('--token='))?.split('=')[1];
if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN');
  process.exit(1);
}

const client = createClient({
  projectId: '8mup540n',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

// Map image files to aircraft names (partial match)
const imageMap: Record<string, string> = {
  'dg500.png': 'DG 500 Trainer "LE"',
  'duo-discus.jpg': 'Duo Discus "B4"',
  'discus-b.jpg': 'Discus B "D16"',
  'asw28.jpg': 'ASW 28 "KM"',
  'ls7.jpeg': 'LS 7-WL NEO "AK"',
  'asg29.png': 'ASG 29 "V"',
};

async function main() {
  console.log('=== Upload Fleet Images to Sanity ===\n');

  const aircraft = await client.fetch<{ _id: string; name: string }[]>(
    '*[_type == "aircraft"]{ _id, name }'
  );

  for (const [filename, aircraftName] of Object.entries(imageMap)) {
    const ac = aircraft.find(a => a.name === aircraftName);
    if (!ac) {
      console.log(`  SKIP: No aircraft found for "${aircraftName}"`);
      continue;
    }

    const filePath = `public/images/fleet/${filename}`;
    try {
      const fileBuffer = readFileSync(filePath);
      const asset = await client.assets.upload('image', fileBuffer, {
        filename: basename(filePath),
      });

      await client.patch(ac._id).set({
        photo: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
        },
      }).commit();

      console.log(`  OK: ${aircraftName} ← ${filename}`);
    } catch (err: unknown) {
      console.error(`  FAILED: ${aircraftName}`, err instanceof Error ? err.message : err);
    }
  }

  console.log('\nDone.');
}

main();
