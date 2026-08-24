# School Manager — Platform Admin

Portail d'administration **plateforme** (rôle `SUPER_ADMIN`) de School Manager.
Ce frontend est **séparé du frontend école** : il ne gère ni élèves, ni notes, ni présences,
ni bulletins, ni classes, ni matières, ni inscriptions.

## Lancer le projet

```bash
bun install   # ou npm install
bun run dev   # http://localhost:5174
```

## Configuration

Créer un fichier `.env` :

```
VITE_API_BASE_URL=http://localhost:8081
```

Valeur par défaut si absente : `http://localhost:8081`.

## Rôle attendu

Seuls les utilisateurs dont `role === "SUPER_ADMIN"` peuvent se connecter.
Tout autre rôle reçoit le message « Ce portail est réservé à l'administrateur de la plateforme. »
et **aucune session n'est stockée**.

La session est isolée du frontend école, sous la clé localStorage :
`school-manager.platform.session`.

## Routes

| Route          | Description                                              |
| -------------- | -------------------------------------------------------- |
| `/login`       | Connexion SUPER_ADMIN                                     |
| `/dashboard`   | Synthèse plateforme (stats calculées côté client)         |
| `/schools`     | Liste des établissements (recherche + filtres client)     |
| `/schools/new` | Création école + compte administrateur d'école            |
| `/schools/:id` | Fiche établissement (lecture seule)                       |

`/` redirige vers `/dashboard` ou `/login` selon la session.

## Endpoints backend utilisés

- `POST /api/auth/login`
- `GET /api/schools`
- `GET /api/schools/{id}`
- `POST /api/schools/with-school-admin`
- `GET /api/users` (dérivation des comptes administrateurs par école)

## Limites liées au Swagger

- Aucun endpoint d'activation/désactivation d'établissement → statut affiché en lecture seule
  avec la mention « Gestion du statut à venir ».
- Aucun endpoint de statistiques plateforme → stats calculées côté client.
- Aucun endpoint « utilisateurs d'une école » → dérivé de `GET /api/users` via `schoolId`.
- Aucun endpoint de paramètres plateforme → entrée « Paramètres » désactivée (« À venir »).
- Le rôle backend du compte administrateur d'école est `DIRECTEUR` dans l'enum du Swagger.
