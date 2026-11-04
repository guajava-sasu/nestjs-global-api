import mongoose from 'mongoose';
import { readFile } from 'node:fs/promises';
import type { Lingot, TypeLingot } from './entities/lingot.entity.js';
import { LingotRecord, LingotSchema } from './entities/lingot.entity.js';
import {
  parserDateParis,
  retirerCentiemes,
  type LegacyLingotStockReel,
} from './lingot-stock-conversion.js';
import { LINGOTS_DATABASE_NAME } from './lingots.constants.js';

const uri =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nestjs-global-api';
const typesLingot = new Set<TypeLingot>(['B', 'OB', 'VB', 'BB', 'N']);
const colonnesRequises = [
  'I_LGT_FOU_DATE',
  'I_LGT_STK_COUL',
  'I_LGT_STK_NUM',
  'D_LGT_STK_PDS',
  'D_LGT_STK_DAT_MAJ',
  'D_LGT_STK_TYP_APA',
] as const;

function nombreCsv(valeur: string, colonne: string, ligne: number): number {
  const nombre = Number(valeur);
  if (!Number.isFinite(nombre)) {
    throw new Error(
      `Valeur numerique invalide pour ${colonne}, ligne ${ligne}.`,
    );
  }
  return nombre;
}

async function lireCsv(): Promise<LegacyLingotStockReel[]> {
  const contenu = await readFile(
    new URL('../../docs/api-examples/lingots/T_LGT_STK.csv', import.meta.url),
    'utf8',
  );
  const lignes = contenu.replace(/^\uFEFF/, '').split(/\r?\n/);
  const entetes = lignes
    .shift()
    ?.split(';')
    .map((entete) => entete.trim());

  if (!entetes) throw new Error('Le CSV est vide.');

  const indexParColonne = new Map(
    entetes.map((entete, index) => [entete, index]),
  );
  const colonnesManquantes = colonnesRequises.filter(
    (colonne) => !indexParColonne.has(colonne),
  );
  if (colonnesManquantes.length > 0) {
    throw new Error(
      `Colonnes manquantes dans le CSV : ${colonnesManquantes.join(', ')}.`,
    );
  }

  const sources: LegacyLingotStockReel[] = [];
  for (const [index, contenuLigne] of lignes.entries()) {
    if (!contenuLigne.trim()) continue;

    const numeroLigne = index + 2;
    const cellules = contenuLigne.split(';');
    if (cellules.length !== entetes.length) {
      throw new Error(
        `La ligne ${numeroLigne} contient ${cellules.length} colonnes au lieu de ${entetes.length}.`,
      );
    }

    const valeur = (colonne: string): string => {
      const position = indexParColonne.get(colonne);
      const cellule = position === undefined ? undefined : cellules[position];
      if (cellule === undefined) {
        throw new Error(`Colonne ${colonne} absente, ligne ${numeroLigne}.`);
      }
      return cellule.trim();
    };

    const dateBain = valeur('D_LGT_STK_DAT_BAIN');
    const pot = valeur('D_LGT_STK_POT');
    const preparation = valeur('D_LGT_STK_PREPA');

    sources.push({
      I_LGT_FOU_DATE: valeur('I_LGT_FOU_DATE'),
      I_LGT_STK_COUL: nombreCsv(
        valeur('I_LGT_STK_COUL'),
        'I_LGT_STK_COUL',
        numeroLigne,
      ),
      I_LGT_STK_NUM: nombreCsv(
        valeur('I_LGT_STK_NUM'),
        'I_LGT_STK_NUM',
        numeroLigne,
      ),
      D_LGT_STK_PDS: nombreCsv(
        valeur('D_LGT_STK_PDS'),
        'D_LGT_STK_PDS',
        numeroLigne,
      ),
      ...(dateBain ? { D_LGT_STK_DAT_BAIN: dateBain } : {}),
      ...(pot
        ? {
            D_LGT_STK_POT: nombreCsv(pot, 'D_LGT_STK_POT', numeroLigne),
          }
        : {}),
      ...(preparation ? { D_LGT_STK_PREPA: preparation } : {}),
      D_LGT_STK_DAT_MAJ: valeur('D_LGT_STK_DAT_MAJ'),
      D_LGT_STK_TYP_APA: valeur('D_LGT_STK_TYP_APA'),
    });
  }

  return sources;
}

function convertirLingot(source: LegacyLingotStockReel): Lingot {
  const type = source.D_LGT_STK_TYP_APA.trim() as TypeLingot;
  if (!typesLingot.has(type)) {
    throw new Error(`Type de lingot inconnu : "${source.D_LGT_STK_TYP_APA}".`);
  }

  const numeroCoulee = String(source.I_LGT_STK_COUL);
  const id = `NYRSTAR-3031-${numeroCoulee}-${String(source.I_LGT_STK_NUM).padStart(3, '0')}`;

  return {
    id,
    codeQR: `A_GENERER-${id}`,
    fournisseur: { nom: 'NON RENSEIGNE', code: 'NON RENSEIGNE' },
    numeroCoulee,
    numeroLingot: source.I_LGT_STK_NUM,
    poids: source.D_LGT_STK_PDS,
    type,
    tauxAluminium: { nom: 'NON RENSEIGNE', couleur: 'inconnue' },
    dateReception: parserDateParis(retirerCentiemes(source.I_LGT_FOU_DATE)),
    reference: id,
    positionActuelle: { code: 'Stock', nom: 'En stock' },
    mouvements: [],
  };
}

async function seedLingotsCsv() {
  const sources = await lireCsv();
  const lingots = sources.map(convertirLingot);
  const ids = new Set<string>();
  for (const lingot of lingots) {
    if (ids.has(lingot.id)) {
      throw new Error(
        `Identifiant lingot duplique dans le CSV : ${lingot.id}.`,
      );
    }
    ids.add(lingot.id);
  }

  await mongoose.connect(uri, { dbName: LINGOTS_DATABASE_NAME });
  const LingotModel = mongoose.model(LingotRecord.name, LingotSchema);
  const resultats = await Promise.all(
    lingots.map((lingot) =>
      LingotModel.updateOne(
        { id: lingot.id },
        { $set: lingot },
        { upsert: true, runValidators: true },
      ),
    ),
  );
  const crees = resultats.reduce(
    (total, resultat) => total + resultat.upsertedCount,
    0,
  );
  const modifies = resultats.reduce(
    (total, resultat) => total + resultat.modifiedCount,
    0,
  );

  console.info(
    `Seed termine dans ${mongoose.connection.name}: ${crees} crees, ${modifies} mis a jour sur ${lingots.length} lingots.`,
  );
}

try {
  await seedLingotsCsv();
} catch (error) {
  console.error('Echec du seed des lingots CSV :', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
