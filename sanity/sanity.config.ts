import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import type { StructureBuilder } from 'sanity/structure';
import { schemas } from './schemas';

// Documents that exist only once
const singletonTypes = new Set(['siteSettings', 'clubHistory']);

const singletonListItem = (
  S: StructureBuilder,
  typeName: string,
  title: string,
) =>
  S.listItem()
    .title(title)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName));

export default defineConfig({
  name: 'piv-studio',
  title: "PIV - Planeurs d'Ille-et-Vilaine",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    structureTool({
      name: 'content',
      title: 'Contenu',
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            // Day-to-day content, open to members
            S.documentTypeListItem('article').title('Actualités'),
            S.documentTypeListItem('event').title('Agenda'),
            S.documentTypeListItem('galleryImage').title('Galerie photos'),
            S.divider(),
            // Pages managed by administrators
            S.documentTypeListItem('clubPage').title('Pages du club'),
            singletonListItem(S, 'clubHistory', 'Histoire du club'),
            S.documentTypeListItem('aircraft').title('Nos planeurs'),
            S.documentTypeListItem('tariff').title('Tarifs'),
            S.documentTypeListItem('flightStory').title('Récits de vols'),
            S.divider(),
            singletonListItem(S, 'siteSettings', 'Réglages du site'),
            S.documentTypeListItem('category').title('Rubriques des actualités'),
            S.documentTypeListItem('page').title('Pages libres'),
          ]),
    }),
  ],

  schema: {
    types: schemas,
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) => !singletonTypes.has(schemaType),
      ),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action && ['publish', 'discardChanges', 'restore'].includes(action),
          )
        : input,
  },
});
