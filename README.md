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

```bash
npm install
npm run start:dev
```

| Variable      | Valeur par défaut                             | Utilisation        |
| ------------- | --------------------------------------------- | ------------------ |
| `PORT`        | `3000`                                        | Port HTTP de l'API |
| `MONGODB_URI` | `mongodb://localhost:27017/nestjs-global-api` | Connexion MongoDB  |

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

Les contrats et exemples sont dans [`docs/api-examples/lingots`](docs/api-examples/lingots). Pour les charger dans MongoDB :

```bash
npm run db:seed:lingots
```

Le seed lit les six fichiers JSON, convertit leurs dates Mongo Extended JSON et synchronise les collections associées. Il génère 100 lingots depuis `lingots-preparation.json`; les livraisons, réceptions, états de stock, mouvements et bilans proviennent des autres fichiers. Les réceptions complètes et leurs lignes sont consultables séparément. Le seed insère ou met à jour les IDs présents, sans supprimer les autres documents.

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
