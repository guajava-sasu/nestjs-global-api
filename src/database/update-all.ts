import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ChutageModule } from '../chutage/chutage.module.js';
import { ChutageService } from '../chutage/chutage.service.js';
import { FicheBobineFilleModule } from '../fiche-bobine-fille/fiche-bobine-fille.module.js';
import { FicheBobineFilleService } from '../fiche-bobine-fille/fiche-bobine-fille.service.js';
import { getMainMongoConfig } from './mongodb.config.js';

const { uri } = getMainMongoConfig();
const totalBobinesFillesCible = 50;
const hotesLocaux = new Set(['localhost', '127.0.0.1', '::1']);

function autoriserReinitialisation() {
  if (process.env.CONFIRM_DB_RESET !== 'true') {
    throw new Error(
      'Mise à jour destructive refusée : définissez CONFIRM_DB_RESET=true pour confirmer explicitement.',
    );
  }
  let hote = '';
  try {
    hote = new URL(uri).hostname;
  } catch {
    hote = '';
  }

  if (!hotesLocaux.has(hote) && process.env.CONFIRM_DB_RESET !== 'true') {
    throw new Error(
      'La mise à jour réinitialise les collections Chutage. Pour une base distante, définissez CONFIRM_DB_RESET=true.',
    );
  }
}

function executerSeedLingots() {
  const script = fileURLToPath(
    new URL('../lingots/seed-lingots.js', import.meta.url),
  );

  return new Promise<void>((resolve, reject) => {
    const processus = spawn(process.execPath, [script], {
      env: process.env,
      stdio: 'inherit',
    });

    processus.once('error', reject);
    processus.once('exit', (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `Le seed Lingots a échoué (${signal ?? `code ${code ?? 'inconnu'}`}).`,
          ),
        );
      }
    });
  });
}

@Module({
  imports: [MongooseModule.forRoot(uri), ChutageModule, FicheBobineFilleModule],
})
class MiseAJourBaseModule {}

async function mettreAJourBase() {
  autoriserReinitialisation();
  await executerSeedLingots();

  const application =
    await NestFactory.createApplicationContext(MiseAJourBaseModule);

  try {
    await application
      .get(ChutageService)
      .updateDatabase('CONFIRM_CHUTAGE_RESET');

    const fichesFilles = application.get(FicheBobineFilleService);
    const existantes = (await fichesFilles.findAll()).length;
    const aGenerer = Math.max(0, totalBobinesFillesCible - existantes);

    if (aGenerer > 0) {
      await fichesFilles.generateRandomFilles(aGenerer);
    }

    console.info(
      `Base mise à jour dans ${uri.replace(/\/\/[^@/]+@/, '//***@')}: ${existantes + aGenerer} fiches bobines filles.`,
    );
  } finally {
    await application.close();
  }
}

await mettreAJourBase();
