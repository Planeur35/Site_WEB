import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import type { StructureBuilder } from 'sanity/structure';
import { schemas } from './schemas';

// Documents that exist only once
const singletonTypes = new Set(['siteSettings', 'clubHistory', 'joinPage', 'discoverPage', 'pricingPage']);

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
  title: "Planeurs d'Ille-et-Vilaine",

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
            S.documentTypeListItem('clubPage').title('Pages de l’association'),
            singletonListItem(S, 'clubHistory', 'Histoire de l’association'),
            singletonListItem(S, 'joinPage', 'Page « Venez voler ! »'),
            singletonListItem(S, 'discoverPage', 'Page « Venez essayer »'),
            S.documentTypeListItem('aircraft').title('Nos planeurs'),
            // One entry « Tarifs » holding the two sides of the pricing: the texts and examples, and the amounts
            S.listItem()
              .title('Tarifs')
              .id('tarifs')
              .child(
                S.list()
                  .title('Tarifs')
                  .items([
                    singletonListItem(S, 'pricingPage', 'Textes et exemples de saison'),
                    S.documentTypeListItem('tariff').title('Montants (lignes de prix)'),
                  ]),
              ),
            S.documentTypeListItem('flightStory').title('Récits de vols'),
            S.documentTypeListItem('partner').title('Partenaires'),
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
