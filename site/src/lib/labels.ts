/** Sections de la page « Le club » : valeur Sanity, ancre dans l'adresse, nom affiché. */
export const CLUB_SECTIONS = [
  {value: 'presentation', anchor: 'presentation', label: 'Présentation'},
  {value: 'platform', anchor: 'plateforme', label: 'La plateforme'},
  {value: 'activities', anchor: 'activites', label: 'Activité des membres'},
  {value: 'training', anchor: 'formation', label: 'Formation initiale'},
  {value: 'campaign', anchor: 'ecole-campagne', label: 'École de campagne'},
  {value: 'competition', anchor: 'competition', label: 'Compétition'},
]

/** Offres tarifaires (valeurs = celles du Studio Sanity). */
export const OFFER_LABELS: Record<string, string> = {
  'forfait-20h': 'Forfait 20h',
  'forfait-illimite': 'Forfait illimité',
  'pack-formation': 'Pack formation',
  'pack-complement-formation': 'Pack complément de formation',
  'vol-initiation': 'Vol d’initiation',
}

/** Menu complet (bouton « Menu » et pied de page). */
export const NAV = [
  {to: '/club', label: 'Le club'},
  {to: '/planeurs', label: 'Nos planeurs'},
  {to: '/adherer', label: 'S’inscrire'},
  {to: '/decouvrir', label: 'Venez essayer'},
  {to: '/actualites', label: 'Actualités'},
  {to: '/recits', label: 'Récits de vols'},
  {to: '/webcam', label: 'Webcam'},
  {to: '/liens', label: 'Liens pratiques'},
]

type NavItem = {to: string; label: string; children?: {to: string; label: string}[]}

/** Les 5 entrées du bandeau, avec sous-menus. */
export const HEADER_NAV: NavItem[] = [
  {
    to: '/club',
    label: 'Le club',
    children: [
      ...CLUB_SECTIONS.map((s) => ({to: `/club#${s.anchor}`, label: s.label})),
      {to: '/club#histoire', label: 'Histoire du club'},
    ],
  },
  {to: '/planeurs', label: 'Nos planeurs'},
  {to: '/adherer', label: 'S’inscrire'},
  {to: '/decouvrir', label: 'Venez essayer'},
  {
    to: '/actualites',
    label: 'Actualités',
    children: [
      {to: '/actualites#news', label: 'Les news'},
      {to: '/actualites#agenda', label: 'Agenda'},
    ],
  },
]

/** Dégradés de ciel utilisés quand une page n'a pas de photo. */
export const HERO_TONES = [
  {from: '#274c77', mid: '#6096ba', to: '#a3c9e8'},
  {from: '#1d3557', mid: '#457b9d', to: '#bde0fe'},
  {from: '#355070', mid: '#6d597a', to: '#a8dadc'},
  {from: '#22577a', mid: '#38a3a5', to: '#bfe6e0'},
]

/** Rubriques de la page « Liens pratiques » (valeurs = celles du Studio Sanity). */
export const LINK_GROUPS = ['Institutions', 'Préparation de vol', 'Météo et conditions', 'Communauté']
