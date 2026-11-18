# Exigences de déploiement — nestjs-global-api

Branche : `master`. Domaine : `global.orfevrus-api.com` (`72.62.27.74`). Node.js VPS : `22.23.5`. Port API : `3002`, lié à `127.0.0.1`. Service : `nestjs-global-api.service`; compte applicatif : `nestjs-global-api`; compte de déploiement : `deploy-nestjs-global-api`.

## Runtime et commandes

- Node.js `>=22.12.0` (npm fourni avec Node).
- Installation de validation : `npm ci`.
- Compilation : `npm run build`.
- Point d'entrée ESM compilé : `dist/main.js` (`package.json` contient `"type": "module"`).
- Lancement : `npm run start:prod` (`node dist/main`).
- Swagger : `/api`; OpenAPI JSON : `/api-json`; export fichier dans un checkout de développement/CI : `npm run openapi:export`.

L'artefact doit inclure `dist/`, `package.json`, `package-lock.json` et les fichiers `docs/api-examples/lingots/` (les scripts de seed les lisent). Installation de production : `npm ci --omit=dev` dans une release neuve.

## Environnement

- `HOST` : adresse d'écoute; `127.0.0.1` est recommandé derrière le proxy HTTPS.
- `PORT` : entier `1..65535`; valeur VPS proposée `3002` (à confirmer au contrat); valeur locale par défaut 3000.
- `NODE_ENV=production` : active la politique CORS de production.
- `MONGODB_URI` : URI de la base principale, requise en production. Base par défaut locale : `nestjs-global-api`.
- `MONGODB_GESTION_LINGOTS_URI` : facultative; si absente, l'URI principale est réutilisée, mais la base `gestion_lingots` est forcée par `dbName`.
- `CORS_ORIGINS` : origines frontend exactes, séparées par des virgules. Vide par défaut; production n'autorise pas localhost automatiquement.
- `CONFIRM_DB_RESET` : réservé aux scripts de maintenance destructifs; ne pas définir dans l'environnement du service.
- `ALLOW_DESTRUCTIVE_HTTP` : doit rester `false`/absent par défaut. À `true`, réactive les routes HTTP DELETE sans authentification intégrée; n'activer qu'après validation d'une politique d'accès.

Les identifiants doivent être conservés dans un fichier d'environnement VPS non suivi par Git et accessibles uniquement au compte du service.

## MongoDB et données

Deux connexions locales sont prévues : `MONGODB_URI` vers `nestjs-global-api`, et `MONGODB_GESTION_LINGOTS_URI` vers `gestion_lingots`. Si la seconde URI est absente, l'URI principale est réutilisée et Mongoose force `dbName=gestion_lingots`. Les bases doivent être neuves/vides au premier démarrage.

Collections de `gestion_lingots` : `configuration`, `operateurs-lingots`, `fournisseurs-lingots`, `taux-aluminium-lingots`, `zones-lingots`, `lingots`, `orphelingots`, `mouvements-lingots`, `inventaires-lingots`, `matte-lingots`, `historique-stock-lingots`. La base principale utilise `fiches-bobines`, `fiches-bobines-filles`, `parc-a-bobines`, ainsi que les collections Chutage `chariots`, `demandes-pontier`, `preparations-chargement`, `bobines-stockage`, `bobines-chutage`, `chutes-bobines`, `chutes-rives`, `ponts-etat-pince`.

Aucune migration ni seed n'est nécessaire au démarrage. Chutage n'insère plus de données d'exemple automatiquement. L'initialisation des exemples reste disponible via la fonction de maintenance `initializeSampleData`, et `db:update:chutage` n'efface puis ne repeuple les collections qu'après `CONFIRM_DB_RESET=true`. `db:seed:gestion-lingots` fait `dropDatabase()` sur `gestion_lingots`; `db:update:all` réinitialise les collections Chutage; `db:sync:taux-aluminium` modifie des documents; `db:convert:lingots-stock` écrit dans `gestion_lingots`; `db:generate:bobines-filles` crée des fiches. Ne les lancer jamais dans le déploiement automatisé. Aucune transformation de production n'a été exécutée.

## HTTP, sécurité et ressources

- `GET /health` : disponibilité HTTP, réponse `{status:"ok"}`.
- `GET /health/ready` : retourne 200 uniquement si les deux connexions Mongo sont connectées; sinon 503 générique.
- Les routes DELETE existantes restent disponibles mais répondent 403 par défaut. L'option `ALLOW_DESTRUCTIVE_HTTP=true` les réactive actuellement sans authentification intégrée; il faut définir un contrôle d'accès avant toute réactivation en production.
- Vérifier également la route HTTPS publique définie par le contrat VPS.
- Aucun stockage fichier persistant requis par les routes applicatives. L'artefact doit garder les exemples JSON/CSV pour les scripts d'administration.
- Le processus doit pouvoir lire sa configuration et son release, écouter sur localhost, et se connecter aux seules bases autorisées. Il n'a pas besoin de privilèges root.

## Authentification à valider avant exposition

L'audit des contrôleurs trouve des routes GET et des routes POST/PATCH/DELETE sans guards d'authentification. Cela inclut les ressources fiches bobines, parc à bobines et lingots. Ne pas exposer l'API au frontend/public avant qu'un mécanisme compatible avec le système d'identité client soit défini et appliqué, ou que le propriétaire accepte explicitement cette exposition. Swagger est lui aussi public en l'état. Le présent changement n'invente aucun mécanisme d'authentification.

## État du contrat VPS

Chemins confirmés : `/var/www/nestjs-global-api`, releases `/var/www/nestjs-global-api/releases`, lien actif `releases/current`, staging `/var/lib/deploy-nestjs-global-api/incoming`, environnement `/etc/nestjs-global-api/production.env`. Outil VPS annoncé : `/usr/local/sbin/nestjs-global-api-release deploy <version>` et `... rollback <version>`.

À confirmer avant activation : port SSH, empreinte hôte validée et entrée known_hosts, autorisation SCP/SFTP du compte limité, nom/format d'archive attendu dans `incoming`, forme autorisée d'invocation du script, sémantique de `rollback <version>`, contrôles de santé effectués par le script et résultat de rollback. Le premier déploiement reste bloqué jusqu'à ces confirmations, à la validation des deux bases MongoDB vides et à la configuration des secrets GitHub.
