import { loadEnvConfig } from '@next/env';
import { defineCliConfig } from 'sanity/cli';

// The Sanity CLI does not read .env.local on its own: load it the way Next.js does
loadEnvConfig(process.cwd());

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
