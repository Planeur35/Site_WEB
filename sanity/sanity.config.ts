import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemas } from './schemas';
import type { StructureBuilder } from 'sanity/structure';

const singletonTypes = new Set(['siteSettings']);

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
  title: 'PIV - Planeur en Ile de France',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            singletonListItem(S, 'siteSettings', 'Site Settings'),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !singletonTypes.has(listItem.getId() as string),
            ),
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
