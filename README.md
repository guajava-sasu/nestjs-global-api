<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

API REST NestJS pour les fiches de bobines, le chutage, le parc à bobines et les données de lingots. Les données sont stockées dans MongoDB.

## Démarrage et configuration

Prérequis : Node.js, npm et une instance MongoDB accessible.

Créez un `.env` local à partir de [`.env.example`](./.env.example) et adaptez les
deux URI MongoDB. Le modèle n'est pas chargé et le `.env` local est ignoré par Git.

```bash
npm install
npm run start:dev
```

L'API, les scripts `db:*` et les tests e2e chargent le `.env` local s'il
existe, sans option Node à ajouter. Les variables déjà définies dans
l'environnement priment sur celles du fichier. Sur le VPS, utilisez la
configuration privée du service.

| Variable                     | Valeur par défaut | Utilisation                           |
| ---------------------------- | ----------------- | ------------------------------------- |
| `PORT`                       | `3000`            | Port HTTP de l'API                    |
| `MONGODB_URI`                | Aucune (requise)  | URI avec le nom de la base principale |
| `MONGODB_GESTION_LINGOTS_URI` | Aucune (requise)  | URI avec le nom de la base lingots    |

L'API autorise les appels CORS depuis `localhost` et `127.0.0.1` sur tous les ports.

## Swagger

- Interface : [http://localhost:3000/api](http://localhost:3000/api)
- Spécification OpenAPI : [http://localhost:3000/api-json](http://localhost:3000/api-json)
- Vérification de l'API : `GET http://localhost:3000/`

Remplacer `3000` si `PORT` est configuré.

## Routes de l'API

Les ressources CRUD acceptent `GET` (liste), `POST` (création), `GET /:id` (détail), `PATCH /:id` (modification) et `DELETE /:id` (suppression).

### Lingots

| Ressource                         | Routes                                                       |
| --------------------------------- | ------------------------------------------------------------ |
| Stock de lingots                  | `/lingots`, `/lingots/:id`                                   |
| Livraisons fournisseur            | `/livraisons-fournisseurs`, `/livraisons-fournisseurs/:id`   |
| Lignes de réception               | `/lignes-reception-lingots`, `/lignes-reception-lingots/:id` |
| Réceptions avec lignes imbriquées | `/receptions-lingots`, `/receptions-lingots/:id`             |
| États de stock journaliers        | `/etats-stock-journaliers`, `/etats-stock-journaliers/:id`   |
| Mouvements                        | `/mouvements-lingots`, `/mouvements-lingots/:id`             |
| Bilans matière journaliers        | `/bilans-lingots-jours`, `/bilans-lingots-jours/:id`         |

Toutes les routes lingots ci-dessus acceptent les cinq méthodes CRUD. Les IDs métier provenant des exemples JSON sont acceptés dans les routes détail; les anciens ObjectId MongoDB restent compatibles.

### Configuration des lingots

La collection `configuration` de la base `nestjs-global-api-lingots` contient un document
par parametre, avec une `cle` unique, une `valeur` JSON non nulle et une
`description` facultative. Elle est creee au demarrage de l'API avec MongoDB
accessible. Aucun parametre n'est ajoute automatiquement.

Les routes CRUD sont `/configuration` et `/configuration/:id` (ObjectId MongoDB).
Exemple de corps pour `POST /configuration` :

```json
{
  "cle": "nombreLingotsMaximum",
  "valeur": 100,
  "description": "Nombre maximal de lingots"
}
```

La valeur `100` est un exemple, a remplacer par la limite souhaitee. Ce parametre
est stocke uniquement : il ne limite pas encore la creation de lingots.
De nouvelles cles peuvent etre ajoutees sans modifier le schema.

### Bobines et chutage

| Ressource                    | Routes                                                                                                           |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Fiches bobines mère          | CRUD `/fiche-bobine-mere`, `/fiche-bobine-mere/:id`                                                              |
| Fiches bobines fille         | CRUD `/fiche-bobine-fille`, `/fiche-bobine-fille/:id`; `GET /fiche-bobine-fille/bobine-mere/:identiteBobineMere` |
| Parc à bobines               | CRUD `/parc-a-bobines`, `/parc-a-bobines/:id`                                                                    |
| Chariots                     | `GET /chutage/chariots`                                                                                          |
| Demandes pontier             | `GET /chutage/demandes-pontier`                                                                                  |
| Préparations de chargement   | `GET /chutage/preparations-chargement`                                                                           |
| Bobines en stockage          | `GET /chutage/bobines-stockage`; filtre `?type=N` ou `?type=S`                                                   |
| Bobines à chuter             | `GET /chutage/bobines-a-chuter`                                                                                  |
| Chutes d'une bobine          | `GET /chutage/chutes-bobines/:bobine`                                                                            |
| Toutes les chutes            | `GET /chutage/chutes`                                                                                            |
| Chutes de rives d'une bobine | `GET /chutage/chutes-rives/:bobine`                                                                              |
| Toutes les chutes de rives   | `GET /chutage/chutes-rives`                                                                                      |
| État des ponts et pinces     | `GET /chutage/ponts-etat-pince`                                                                                  |

## Exemples et données lingots

Les contrats et exemples sont dans [`docs/api-examples/lingots`](docs/api-examples/lingots). Ils ne sont pas chargés au démarrage. Le seed `npm run db:seed:gestion-lingots` remplace toute la base dédiée configurée par `MONGODB_GESTION_LINGOTS_URI` et exige `CONFIRM_DB_RESET=true`; ne l'exécutez pas sur une base contenant des données à conserver.

## Vérification

```bash
npm run build
npm run lint
npm test
```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observer](https://observer.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Contrat
Updated todo list

Read

Read

Je vais mettre en place la partie backend dans ton projet (configuration Swagger partagée + export d’un `openapi.json`), puis je te donne la partie Angular, qui n’est pas dans ce workspace.

Created



Created

Replacing 21 lines with 17 lines in , ,


```

```

```

```

```

```


Ran terminal command: rtk npm run openapi:export

Ran terminal command: rtk node -e "const d=require('./openapi.json'); const ids=[]; let sansSchema=0, total=0; for (const [p,ops] of Object.entries(d.paths)) for (const [m,o] of Object.entries(ops)) { total++; ids.push(o.operationId); const r=Object.values(o.responses||{})[0]; if(!r||!r.content) sansSchema++; } console.log('operations:', total, '| operationId dupliques:', ids.length-new Set(ids).size, '| sans schema de reponse:', sansSchema); console.log('schemas:', Object.keys(d.components.schemas).length); console.log(JSON.stringify(d.paths['/mouvements-lingots'].get, null, 1).slice(0,400));"

Replacing 3 lines with 5 lines in


```

```


Created 4 todos

Ran terminal command: rtk npm run openapi:export; rtk node -e "const d=require('./openapi.json'); const ids=Object.values(d.paths).flatMap(o=>Object.values(o).map(x=>x.operationId)); console.log('operationId dupliques:', ids.length-new Set(ids).size, '| exemple:', d.paths['/mouvements-lingots'].get.operationId)"; rtk npm test; rtk npm run lint

Le backend produit maintenant un fichier de contrat versionnable, `openapi.json`. Il compte 38 routes (77 opérations HTTP), et chaque `operationId` est unique, ce qui est nécessaire pour générer un client propre. Le build, les tests et le lint passent.

## 1. Approche recommandée : partir du code backend

Avec NestJS, le plus simple est de générer le contrat depuis le code (*code-first*). Tes DTO et tes décorateurs `@ApiProperty` / `@ApiOperation` décrivent déjà l’API, donc le contrat reste aligné sur ce qui tourne réellement.

Le flux complet :

```
NestJS (DTO + décorateurs) → openapi.json (versionné dans Git) → génération dans Angular → services et types
```

Écrire le contrat à la main d’abord (*contract-first*) n’est utile que si plusieurs équipes doivent se mettre d’accord avant d’écrire le code. Dans ton cas, cela ajouterait une double maintenance.

## 2. Ce qui est en place dans ton backend

- `openapi.ts` : la configuration Swagger est centralisée et sert à la fois à `/api` et à l’export du fichier. Les `operationId` sont de la forme `Lingots_findAllMouvements` et deviennent les noms de méthodes côté Angular.
- `export-openapi.ts` : écrit `openapi.json` sans démarrer le serveur ni se connecter à MongoDB, donc il peut tourner en intégration continue.
- `nest-cli.json` : le plugin `@nestjs/swagger` est activé. Il déduit une partie de la documentation directement des types TypeScript et des commentaires.
- `package.json` : nouveau script `npm run openapi:export`.

**Point à corriger pour avoir des types utiles côté Angular :** 26 opérations n’ont aucun schéma de réponse, et les autres sont décrites seulement comme `object`. Les contrôleurs renvoient des documents Mongoose, que Swagger ne sait pas décrire. Sans correction, le client généré renverra des types `any` ou `object`. Il faut déclarer une classe de réponse par ressource, par exemple pour les mouvements :

```typescript
// dto/mouvement-response.dto.ts
export class MouvementResponseDto {
  @ApiProperty() _id: string;
  @ApiProperty({ type: ZoneResponseDto, nullable: true }) depart: ZoneResponseDto | null;
  @ApiProperty({ type: ZoneResponseDto }) arrivee: ZoneResponseDto;
  @ApiProperty() date: Date;
  @ApiProperty({ type: OperateurResponseDto }) operateur: OperateurResponseDto;
  @ApiProperty({ type: LingotResponseDto }) lingot: LingotResponseDto;
}

// lingots.controller.ts
@ApiOkResponse({ type: [MouvementResponseDto] })
@Get('mouvements-lingots')
findAllMouvements() { ... }
```

Je peux ajouter ces classes de réponse pour tout le module lingots si tu veux.

## 3. Consommer le contrat dans Angular

Je te recommande **`ng-openapi-gen`**. Il est fait pour Angular, génère des services `@Injectable` basés sur `HttpClient` et des interfaces TypeScript, et ne nécessite pas Java.

Fichier `ng-openapi-gen.json` à la racine du projet Angular :

```json
{
  "$schema": "node_modules/ng-openapi-gen/ng-openapi-gen-schema.json",
  "input": "../nestjs-global-api/openapi.json",
  "output": "src/app/api",
  "ignoreUnusedModels": false
}
```

Dans `app.config.ts` :

```typescript
import { provideHttpClient } from '@angular/common/http';
import { ApiConfiguration } from './api/api-configuration';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    { provide: ApiConfiguration, useValue: { rootUrl: 'http://localhost:3000' } },
  ],
};
```

Utilisation dans un composant :

```typescript
import { LingotsService } from '../api/services';

export class MouvementsComponent {
  private readonly api = inject(LingotsService);
  mouvements$ = this.api.lingotsFindAllMouvements(); // nom dérivé de l'operationId
}
```

Vérifie le nom exact des services et des méthodes dans `src/app/api/services` après la première génération. Ne modifie jamais ce dossier à la main : il est régénéré à chaque fois.

Alternatives possibles :
- `@openapitools/openapi-generator-cli` (générateur `typescript-angular`) : plus complet, mais nécessite Java.
- `orval` : intéressant si tu veux aussi générer des mocks.

## 4. Commandes

**Backend** (`@nestjs/swagger` est déjà installé) :

```powershell
npm run openapi:export   # régénère openapi.json après chaque changement d'API
```

**Frontend Angular** :

```powershell
npm install -D ng-openapi-gen
npx ng-openapi-gen --config ng-openapi-gen.json
```

Script conseillé dans le `package.json` Angular :

```json
"scripts": {
  "api:generate": "ng-openapi-gen --config ng-openapi-gen.json"
}
```

Tu peux aussi lire le contrat directement depuis l’API lancée, via `"input": "http://localhost:3000/api-json"`. Le fichier versionné reste préférable : chaque changement d’API apparaît dans les revues de code, et l’intégration continue peut échouer si `openapi.json` n’a pas été régénéré.

Updated todo list


J’ai ajouté les classes de réponse au module lingots : ses 50 opérations décrivent maintenant précisément ce qu’elles renvoient, au lieu de `object`. Un client Angular généré aura donc de vrais types, par exemple `Observable<MouvementResponseDto[]>` au lieu de `any`.

Le contrat `openapi.json` a été régénéré, et les tests et le lint passent. J’ai aussi comparé les DTO à des documents réellement stockés dans la base (mouvement, lingot, historique, opérateur) : aucun champ ne manque d’un côté ni de l’autre.

## Comment ça marche

**1. Une classe par forme de réponse :** `lingot-response.dto.ts`

Chaque classe décrit le JSON réellement envoyé, pas le modèle Mongoose. Par exemple, `_id` est déclaré comme `string`, parce qu’un `ObjectId` est transformé en texte lors de l’envoi.

```typescript
export class MouvementResponseDto extends MongoDocumentResponseDto {
  @ApiProperty({ type: () => ZoneResponseDto, nullable: true })
  depart: ZoneResponseDto | null;
  @ApiProperty({ type: () => ZoneResponseDto })
  arrivee: ZoneResponseDto;
  @ApiProperty({ type: () => LingotResponseDto })
  lingot: LingotResponseDto;
  // ...
}
```

`MongoDocumentResponseDto` regroupe `_id`, `createdAt` et `updatedAt`, communs à toutes les ressources. La syntaxe `type: () => …` permet d’imbriquer les classes sans dépendre de leur ordre dans le fichier.

**2. Trois décorateurs regroupés :** `api-reponses.decorators.ts`

Ils évitent de répéter les mêmes déclarations sur chaque route :

| Décorateur | Réponses déclarées |
|---|---|
| `@ApiCreation(Dto)` | 201 avec le DTO, 400 si le corps est invalide |
| `@ApiListe(Dto)` | 200 avec un tableau de DTO |
| `@ApiElement(Dto)` | 200 avec le DTO, 404 si introuvable ou `_id` invalide |

**3. Utilisation dans le contrôleur :** `lingots.controller.ts`

```typescript
@ApiListe(MouvementResponseDto)
@Get('mouvements-lingots')
findAllMouvements() { ... }
```

## Ce qui reste à faire

- **Garder les DTO à jour :** ces classes ne servent qu’à la documentation. Si tu ajoutes un champ dans `lingot.entity.ts`, ajoute-le aussi dans le DTO de réponse, puis relance `npm run openapi:export`.
- **Autres modules :** les 26 opérations encore sans schéma sont dans `fiche-bobine-mere`, `fiche-bobine-fille`, `parc-a-bobines` et `chutage`. On peut leur appliquer le même procédé.

Completed: *Implement response DTOs for lingots module* (1/3)

Made changes.
