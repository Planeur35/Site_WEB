import type {StructureResolver} from 'sanity/structure'

/**
 * Menu du Studio.
 * - Un membre (rôle Éditeur) ne voit que « Actualités » et « Agenda ».
 * - Un administrateur voit tout.
 * Attention : cela simplifie l'écran, mais ce n'est pas une barrière de sécurité.
 */
export const structure: StructureResolver = (S, context) => {
  const roles = context.currentUser?.roles.map((role) => role.name) ?? []
  const isAdmin = roles.includes('administrator')

  const memberItems = [
    S.documentTypeListItem('news').title('Actualités'),
    S.documentTypeListItem('event').title('Agenda'),
  ]

  if (!isAdmin) {
    return S.list().title('Contenu').items(memberItems)
  }

  return S.list()
    .title('Contenu')
    .items([
      ...memberItems,
      S.divider(),
      S.documentTypeListItem('clubPage').title('Pages du club'),
      S.documentTypeListItem('glider').title('Nos planeurs'),
      S.documentTypeListItem('tariff').title('Tarifs'),
      S.documentTypeListItem('flightStory').title('Récits de vols'),
      S.divider(),
      S.listItem()
        .title('Réglages du site')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Histoire du club')
        .id('clubHistory')
        .child(S.document().schemaType('clubHistory').documentId('clubHistory')),
    ])
}
