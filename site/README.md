# Site PIV : Planeurs d'Ille-et-Vilaine (planeur35.org)

Site statique Astro + Tailwind, alimenté par Sanity. Il est construit et mis en ligne par Vercel : aucune installation n'est nécessaire.

## Variables d'environnement à saisir dans Vercel

| Nom | Valeur |
|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | l'identifiant du projet Sanity |
| `PUBLIC_SANITY_DATASET` | `production` |
| `PUBLIC_SITE_URL` | `https://planeur35.org` |

## Pages

| Adresse | Contenu |
|---|---|
| `/` | Diaporama d'accueil, chiffres clés, trois entrées, dernières nouvelles |
| `/club` | Toutes les sections du club et l'histoire |
| `/planeurs` | Les planeurs, un par un |
| `/adherer` | Tarifs des forfaits et de la formation, modalités d'inscription |
| `/decouvrir` | Vol d'initiation, tarif, lien de réservation et de paiement |
| `/actualites` | Actualités (accordéon, partage) et agenda |
| `/actualites/<date-titre>` | Une actualité, avec aperçu de partage (titre et photo) |
| `/recits` | Récits de beaux vols, avec lien WeGlide |
| `/webcam` | Image de la webcam, actualisée toutes les minutes |
| `/liens` | Liens pratiques par rubrique |

## Logo

Dans `public/` : `logo.png` (complet, aussi utilisé pour l'aperçu des liens partagés), `logo-icon.png` (en-tête et pied de page) et `favicon.png`.

## À savoir

- Les polices sont celles du système : aucune requête vers un service de polices.
- La webcam suppose une **image** (adresse en .jpg). Si votre webcam fournit plutôt une page, remplacez la balise `<img>` par un `<iframe>` dans `src/pages/webcam.astro`.
- Il reste à ajouter les mentions légales.
- Pour tester en local (facultatif, réservé à qui a Node.js) : `npm install`, copier `.env.example` en `.env`, puis `npm run dev`.
