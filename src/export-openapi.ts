import { NestFactory } from '@nestjs/core';
import { writeFile } from 'node:fs/promises';
import { AppModule } from './app.module.js';
import { createOpenApiDocument } from './openapi.js';

// preview: true construit le graphe des modules sans se connecter à MongoDB.
const app = await NestFactory.create(AppModule, {
  preview: true,
  logger: false,
});
try {
  const document = createOpenApiDocument(app);
  await writeFile('openapi.json', `${JSON.stringify(document, null, 2)}\n`);
  console.info(
    `openapi.json généré : ${Object.keys(document.paths).length} routes.`,
  );
} finally {
  await app.close();
}
