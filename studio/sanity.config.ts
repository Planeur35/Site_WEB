import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

// Identifiant du projet Sanity, lu dans les variables d'environnement de Vercel
const projectId = process.env.SANITY_STUDIO_PROJECT_ID
if (!projectId) {
  throw new Error('SANITY_STUDIO_PROJECT_ID est manquant : ajoutez cette variable dans les réglages du projet Vercel.')
}

// Documents qui n'existent qu'en un seul exemplaire
const singletons = ['siteSettings', 'clubHistory']

export default defineConfig({
  name: 'default',
  title: 'PIV – planeur35.org',

  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool({structure})],

  schema: {
    types: schemaTypes,
    // Empêche de créer un deuxième document « Réglages » ou « Histoire »
    templates: (templates) => templates.filter(({schemaType}) => !singletons.includes(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletons.includes(context.schemaType)
        ? input.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
})
