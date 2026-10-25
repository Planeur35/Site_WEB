# Studio Sanity : outil de saisie des contenus de PIV

Ce dossier est construit et mis en ligne par Vercel : aucune installation n'est nécessaire.

| Fichier | Rôle |
|---|---|
| `sanity.config.ts` | Configuration du Studio |
| `structure.ts` | Menu : les membres ne voient que Actualités et Agenda |
| `schemaTypes/` | Un fichier par type de contenu |
| `sanity.cli.ts`, `vercel.json`, `package.json`, `tsconfig.json` | Fichiers techniques de construction |

## Variables d'environnement à saisir dans Vercel

| Nom | Valeur |
|---|---|
| `SANITY_STUDIO_PROJECT_ID` | l'identifiant du projet Sanity |
| `SANITY_STUDIO_DATASET` | `production` |

## Remarques pour le site

- Les news, planeurs et récits n'ont pas d'adresse saisie à la main : le site la calcule à partir de la date et du titre.
- Les chiffres clés (`siteSettings`) sont saisis une fois par an : aucune connexion aux données internes du club.
- Les tarifs sont regroupés par le site : **Forfaits** (`forfait-20h`, `forfait-illimite`, avec `under25` / `over25`), **Formation** (`pack-formation`, `pack-complement-formation`) et **Baptêmes** (`vol-initiation`).
- Les **pages du club** (`clubPage`) ont une valeur `section` : `presentation`, `platform`, `activities`, `training`, `campaign`, `competition`. Le schéma du cursus n'existe que pour `training`.
- Les **réglages du site** contiennent les photos du diaporama d'accueil, les textes des pages « S'inscrire » et « Venez essayer », le lien de la plateforme de paiement du club et l'image de la webcam.
- Les **liens pratiques** se rangent en 4 rubriques : Institutions, Préparation de vol, Météo et conditions, Communauté.
