# Déploiement

## Architecture et activation

La cible est `global.orfevrus-api.com` (`72.62.27.74`), branche `master`, port API `3002` lié à `127.0.0.1`, service `nestjs-global-api.service`. Le job CI s'exécute sur chaque push `master`. Le job de déploiement est fermé tant que `GLOBAL_VPS_CONTRACT_CONFIRMED` n'est pas `true`; l'automatisation sur push attend en plus `GLOBAL_AUTO_DEPLOY_ENABLED=true`.

Pour le premier déploiement contrôlé : valider les éléments VPS ci-dessous, ajouter les secrets et variables, définir uniquement `GLOBAL_VPS_CONTRACT_CONFIRMED=true`, puis lancer `workflow_dispatch` avec `deploy=true`. Après un succès vérifié, définir `GLOBAL_AUTO_DEPLOY_ENABLED=true` pour activer les déploiements sur chaque push `master`. Un dispatch normal a `deploy=false` par défaut.

Le transfert utilise une archive versionnée et son checksum dans `/var/lib/deploy-nestjs-global-api/incoming/`, puis appelle `/usr/local/sbin/nestjs-global-api-release deploy <version>`. Le rollback passe par le même outil VPS. Le nom d'archive, le protocole de transfert, le port SSH, les droits d'exécution et la sémantique exacte de `rollback <version>` doivent être confirmés par Codex VPS avant de définir `GLOBAL_VPS_CONTRACT_CONFIRMED=true`.

## Configuration et build

Copier `.env.example` dans un emplacement privé VPS et remplacer les valeurs d'exemple. `HOST=127.0.0.1`, `PORT=3002` (proposé), `NODE_ENV=production`, `MONGODB_URI` et `MONGODB_GESTION_LINGOTS_URI` obligatoires avec les noms `nestjs-global-api` et `nestjs-global-api-lingots` dans leurs chemins, puis `CORS_ORIGINS` avec les seules origines frontend approuvées. La base existante `gestion_lingots` est exclue. Les bases dédiées démarreront vides; l'application ne les peuple pas automatiquement.

```sh
npm ci
npm run lint
npm test
npm run build
npm run start:prod
```

Le binaire d'entrée compilé est `dist/main.js`. Swagger est servi sous `/docs` et `/api`; l'export statique est produit par `npm run openapi:export`.

## GitHub Actions et rollback

Le workflow utilise les secrets GitHub Actions suivants (dans **Settings → Environments → production → Environment secrets**, ou les secrets du dépôt si aucun contrôle d'environnement n'est requis) :

- `GLOBAL_VPS_HOST` : `global.orfevrus-api.com`.
- `GLOBAL_VPS_USER` : `deploy-nestjs-global-api`.
- `GLOBAL_VPS_SSH_KEY` : contenu complet de la clé privée dédiée, jamais la clé `.pub`.
- `GLOBAL_VPS_KNOWN_HOSTS` : entrée OpenSSH vérifiée pour `global.orfevrus-api.com` (ou `[global.orfevrus-api.com]:<port>` si le port n'est pas 22). Le workflow exige le fingerprint hôte ED25519 confirmé `SHA256:8kNm9acB4FPL9C7YxG0zyM5DouzK/va0QthWmm5yqsY` et conserve `StrictHostKeyChecking=yes`.

Variables Actions requises : `GLOBAL_VPS_SSH_PORT` (22), `GLOBAL_VPS_CONTRACT_CONFIRMED`, `GLOBAL_ROLLBACK_CONFIRMED`, `GLOBAL_MONGODB_VALIDATED` et `GLOBAL_AUTO_DEPLOY_ENABLED`. Garder les confirmations et l'auto-déploiement à `false` tant que les vérifications correspondantes ne sont pas faites. Le premier push avec `GLOBAL_AUTO_DEPLOY_ENABLED=false` ne lance que la CI; une demande manuelle de déploiement reste distincte et soumise aux confirmations.

Le protocole restreint confirmé est `ping`, `upload <version> <sha256>` (archive tar.gz via stdin SSH), `verify <version> <sha256>`, `deploy <version> <sha256>` et `rollback <version-existante>`. L'artefact embarque `package.json`, `package-lock.json`, `dist/` et les dépendances de production installées sur Ubuntu 24.04 avec Node 22.23.5. Le workflow vérifie le checksum avant d'appeler `deploy`, puis contrôle `/health` et `/health/ready` en HTTPS sur `global.orfevrus-api.com`.

La sémantique transactionnelle du rollback après activation n'est pas encore confirmée par un résultat direct de Codex VPS. En particulier, les contrôles HTTPS GitHub ont lieu après la commande `deploy`; si l'un échoue, le workflow échoue sans deviner un numéro de release ni appeler `rollback` avec une cible supposée. Avant tout déploiement, Codex VPS doit confirmer que `deploy` vérifie la readiness avant de rendre la release active et restaure automatiquement l'ancienne release si ses propres contrôles échouent, et fournir une méthode autorisée permettant à GitHub de restaurer sans ambiguïté la release précédente après un échec HTTPS externe (y compris le cas sans release précédente). Le job de déploiement reste bloqué tant que `GLOBAL_ROLLBACK_CONFIRMED` n'est pas `true`.

## Clé SSH dédiée

Clé Ed25519 dédiée créée hors du dépôt :

- Privée : `C:\Users\ranon\.ssh\global-orfevrus-api_ed25519`
- Publique à transmettre à Codex VPS : `C:\Users\ranon\.ssh\global-orfevrus-api_ed25519.pub`

La clé privée, générée sans passphrase pour l'usage non interactif de GitHub Actions, a une ACL Windows limitée au compte local (ainsi qu'à SYSTEM et aux administrateurs). Transmettre uniquement le fichier `.pub` à Codex VPS pour installer la clé dans `authorized_keys` du compte de déploiement. Pour renseigner le secret sans afficher la clé dans le chat, ouvrir le fichier privé dans un éditeur local et coller son contenu directement dans le champ `GLOBAL_VPS_SSH_KEY` de GitHub; vider le presse-papiers après l'enregistrement. Ne jamais joindre ni committer le fichier privé.

La clé d'hôte ED25519 annoncée par Codex VPS a le fingerprint ci-dessus. L'entrée du secret GitHub doit correspondre au domaine utilisé par SSH; le job compare cette entrée au fingerprint attendu avant toute connexion. Une sortie `ssh-keyscan` non validée ne suffit pas.

## Diagnostics

- Service : `systemctl status <service>` et `journalctl -u <service> -n 100`.
- Liveness : `GET /health`; readiness Mongo : `GET /health/ready`.
- En cas de 503 readiness, vérifier les URI, DNS, réseau, droits Mongo et disponibilité des deux bases sans afficher les identifiants.
- En cas d'erreur SSH, vérifier le secret clé, le fingerprint connu_hosts, l'utilisateur et les droits staging.
- En cas d'échec de santé post-release, vérifier que le script VPS a restauré le lien `current` précédent et consulté les logs systemd.
- `npm ci` échoue si le lockfile est désynchronisé; Node doit être `>=22.12.0`.
- Ne pas lancer les commandes `db:seed:*`, `db:update:*`, `db:sync:*`, `db:convert:*` ou `db:generate:*` comme étape de déploiement; plusieurs remplacent ou modifient des données.

## Éléments VPS encore requis

À confirmer directement par Codex VPS avant d'activer un déploiement : garantie de rollback automatique lors d'un échec interne à `deploy`; méthode restreinte pour restaurer la version précédente si les vérifications HTTPS externes échouent après activation; et résultat attendu lors du premier déploiement sans release précédente. Aucun appel distant de rollback n'est effectué par le workflow avec une version supposée.
