# Déploiement

## Architecture et activation

La cible est `global.orfevrus-api.com` (`72.62.27.74`), branche `master`, port API `3002` lié à `127.0.0.1`, service `nestjs-global-api.service`. Le job CI s'exécute sur chaque push `master`. Le job de déploiement est fermé tant que `GLOBAL_VPS_CONTRACT_CONFIRMED` n'est pas `true`; l'automatisation sur push attend en plus `GLOBAL_AUTO_DEPLOY_ENABLED=true`.

Pour le premier déploiement contrôlé : valider les éléments VPS ci-dessous, ajouter les secrets et variables, définir uniquement `GLOBAL_VPS_CONTRACT_CONFIRMED=true`, puis lancer `workflow_dispatch` avec `deploy=true`. Après un succès vérifié, définir `GLOBAL_AUTO_DEPLOY_ENABLED=true` pour activer les déploiements sur chaque push `master`. Un dispatch normal a `deploy=false` par défaut.

Le transfert utilise une archive versionnée et son checksum dans `/var/lib/deploy-nestjs-global-api/incoming/`, puis appelle `/usr/local/sbin/nestjs-global-api-release deploy <version>`. Le rollback passe par le même outil VPS. Le nom d'archive, le protocole de transfert, le port SSH, les droits d'exécution et la sémantique exacte de `rollback <version>` doivent être confirmés par Codex VPS avant de définir `GLOBAL_VPS_CONTRACT_CONFIRMED=true`.

## Configuration et build

Copier `.env.example` dans un emplacement privé VPS et remplacer les valeurs d'exemple. `HOST=127.0.0.1`, `PORT=3002` (proposé), `NODE_ENV=production`, deux URI vers `nestjs-global-api` et `gestion_lingots`, puis `CORS_ORIGINS` avec les seules origines frontend approuvées. Les bases seront démarrées vides; l'application ne les peuple plus automatiquement.

```sh
npm ci
npm run lint
npm test
npm run build
npm run start:prod
```

Le binaire d'entrée compilé est `dist/main.js`. Swagger est servi sous `/api`; l'export statique est produit par `npm run openapi:export`.

## GitHub Actions et rollback

Le workflow utilise les secrets GitHub Actions suivants (dans **Settings → Environments → production → Environment secrets**, ou les secrets du dépôt si aucun contrôle d'environnement n'est requis) :

- `GLOBAL_VPS_HOST` : `global.orfevrus-api.com`.
- `GLOBAL_VPS_USER` : `deploy-nestjs-global-api`.
- `GLOBAL_VPS_SSH_KEY` : contenu complet de la clé privée dédiée, jamais la clé `.pub`.
- `GLOBAL_VPS_KNOWN_HOSTS` : entrée(s) OpenSSH vérifiée(s) remises ou confirmées par Codex VPS pour le domaine et le port SSH exacts. Ne pas utiliser une sortie de `ssh-keyscan` non vérifiée.

Variables Actions requises : `GLOBAL_VPS_SSH_PORT` (port confirmé par Codex VPS), `GLOBAL_VPS_CONTRACT_CONFIRMED` (laisser absent/faux jusque-là), `GLOBAL_MONGODB_VALIDATED` (passer à `true` seulement après vérification des deux URI, des permissions et de l'état vide initial), puis `GLOBAL_AUTO_DEPLOY_ENABLED` (laisser absent/faux avant le premier déploiement contrôlé). Le workflow impose `StrictHostKeyChecking=yes` et ne désactive pas la vérification d'hôte.

Le compte SSH doit accepter l'envoi SFTP/SCP vers le répertoire `incoming` et l'exécution autorisée de la commande de release sans présumer de `sudo`. Le script VPS doit vérifier le checksum, créer une release immuable, installer les dépendances, basculer `current` atomiquement, redémarrer le service, contrôler la readiness et gérer le rollback. Le job vérifie ensuite `https://global.orfevrus-api.com/health` et `/health/ready`; en cas d'échec, il demande le rollback au même outil VPS, puis fait échouer le job.

## Clé SSH dédiée

Clé Ed25519 dédiée créée hors du dépôt :

- Privée : `C:\Users\ranon\.ssh\global-orfevrus-api_ed25519`
- Publique à transmettre à Codex VPS : `C:\Users\ranon\.ssh\global-orfevrus-api_ed25519.pub`

La clé privée, générée sans passphrase pour l'usage non interactif de GitHub Actions, a une ACL Windows limitée au compte local (ainsi qu'à SYSTEM et aux administrateurs). Transmettre uniquement le fichier `.pub` à Codex VPS pour installer la clé dans `authorized_keys` du compte de déploiement. Pour renseigner le secret sans afficher la clé dans le chat, ouvrir le fichier privé dans un éditeur local et coller son contenu directement dans le champ `GLOBAL_VPS_SSH_KEY` de GitHub; vider le presse-papiers après l'enregistrement. Ne jamais joindre ni committer le fichier privé.

Le fichier `C:\Users\ranon\.ssh\known_hosts` actuel ne contient pas d'entrée pour le domaine ni l'IP. Ajouter son empreinte uniquement après réception de la valeur validée par Codex VPS, puis copier l'entrée connue dans `GLOBAL_VPS_KNOWN_HOSTS`. Le port SSH et le fingerprint restent à confirmer.

## Diagnostics

- Service : `systemctl status <service>` et `journalctl -u <service> -n 100`.
- Liveness : `GET /health`; readiness Mongo : `GET /health/ready`.
- En cas de 503 readiness, vérifier les URI, DNS, réseau, droits Mongo et disponibilité des deux bases sans afficher les identifiants.
- En cas d'erreur SSH, vérifier le secret clé, le fingerprint connu_hosts, l'utilisateur et les droits staging.
- En cas d'échec de santé post-release, vérifier que le script VPS a restauré le lien `current` précédent et consulté les logs systemd.
- `npm ci` échoue si le lockfile est désynchronisé; Node doit être `>=22.12.0`.
- Ne pas lancer les commandes `db:seed:*`, `db:update:*`, `db:sync:*`, `db:convert:*` ou `db:generate:*` comme étape de déploiement; plusieurs remplacent ou modifient des données.

## Éléments VPS encore requis

Codex VPS doit confirmer : port SSH, fingerprint/ligne `known_hosts`, protocole SCP/SFTP permis au compte limité, forme exacte du fichier attendu dans `incoming`, exécution exacte de la commande `deploy`, sens de l'argument de `rollback`, et garantie que la commande gère elle-même les échecs du redémarrage/health check. Le workflow reste volontairement bloqué tant que ces confirmations ne sont pas enregistrées.
