import mongoose from 'mongoose';
import { readFile } from 'node:fs/promises';
import type {
  BilanLingotsJour,
  EtatStockJournalier,
  LingotStock,
  LivraisonFournisseur,
  MouvementLingot,
  ReceptionLingot,
} from './entities/lingot.entity.js';
import {
  BilanLingotsJourRecord,
  BilanLingotsJourSchema,
  EtatStockJournalierRecord,
  EtatStockJournalierSchema,
  LigneReceptionLingotRecord,
  LigneReceptionLingotSchema,
  LingotStockRecord,
  LingotStockSchema,
  LivraisonFournisseurRecord,
  LivraisonFournisseurSchema,
  MouvementLingotRecord,
  MouvementLingotSchema,
  ReceptionLingotRecord,
  ReceptionLingotSchema,
} from './entities/lingot.entity.js';

const uri =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nestjs-global-api';

async function readExample<T>(fileName: string): Promise<T> {
  const content = await readFile(
    new URL(`../../docs/api-examples/lingots/${fileName}`, import.meta.url),
    'utf8',
  );

  return JSON.parse(content, (_key, value: unknown) => {
    if (value && typeof value === 'object' && '$date' in value) {
      const date = value.$date;
      if (typeof date === 'string') return new Date(date);
    }
    return value;
  }) as T;
}

function asArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

function requiredId(record: { id?: string }): string {
  if (!record.id) throw new Error('Un exemple de lingot ne contient pas id.');
  return record.id;
}

const repetitionsParExemple = 50;
const jourEnMs = 24 * 60 * 60 * 1000;

function idGenere(id: string, index: number): string {
  return index === 0 ? id : `${id}-${String(index + 1).padStart(3, '0')}`;
}

function couleeGeneree(numeroCoulee: string, index: number): string {
  if (index === 0) return numeroCoulee;
  const base = numeroCoulee.replace(/-\d+$/, '');
  return `${base}-${String(index + 1).padStart(2, '0')}`;
}

function dateGeneree(date: Date, index: number): Date {
  return new Date(date.getTime() + index * jourEnMs);
}

function echapperRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function seedLingots() {
  const stockExamples = asArray(
    await readExample<LingotStock[]>('lingots-preparation.json'),
  );
  const livraisonExamples = asArray(
    await readExample<LivraisonFournisseur[]>('livraisons-fournisseur.json'),
  );
  const receptionExamples = asArray(
    await readExample<ReceptionLingot>('reception-lingots.json'),
  );
  const etatExamples = asArray(
    await readExample<EtatStockJournalier[]>('etats-stock-journaliers.json'),
  );
  const mouvementExamples = asArray(
    await readExample<MouvementLingot[]>('mouvements-lingots.json'),
  );
  const bilanExamples = asArray(
    await readExample<BilanLingotsJour[]>('bilans-matiere.json'),
  );

  const lingots = stockExamples.flatMap((exemple) =>
    Array.from({ length: repetitionsParExemple }, (_, index) => ({
      ...exemple,
      id: idGenere(exemple.id, index),
      numeroLingot: exemple.numeroLingot + index,
      numeroCoulee: couleeGeneree(exemple.numeroCoulee, index),
      poids: exemple.poids + ((index * 37) % 41) - 20,
      dateReception: dateGeneree(exemple.dateReception, Math.floor(index / 10)),
    })),
  );
  const livraisons = livraisonExamples.flatMap((exemple) =>
    Array.from({ length: repetitionsParExemple }, (_, index) => ({
      ...exemple,
      id: idGenere(requiredId(exemple), index),
      numeroCoulee: couleeGeneree(exemple.numeroCoulee, index),
      dateLivraison: dateGeneree(exemple.dateLivraison, index),
      nbLingots: Math.max(1, exemple.nbLingots + (index % 5) - 2),
      tonnage: Number((exemple.tonnage + ((index % 5) - 2) * 0.08).toFixed(2)),
    })),
  );
  const receptions = receptionExamples.flatMap((exemple) =>
    Array.from({ length: repetitionsParExemple }, (_, index) => {
      const numeroCoulee = couleeGeneree(exemple.numeroCoulee, index);
      return {
        ...exemple,
        id: idGenere(exemple.id, index),
        numeroCoulee,
        dateReception: dateGeneree(exemple.dateReception, index),
        lignesReception: exemple.lignesReception.map((ligne) => ({
          ...ligne,
          numeroLingotCoulee: ligne.numeroLingotCoulee
            ? `${numeroCoulee}-${String(ligne.numero).padStart(2, '0')}`
            : '',
        })),
      };
    }),
  );
  const lignesReception = receptions.flatMap((reception) =>
    reception.lignesReception.map((ligne) => ({
      ...ligne,
      id: `${reception.id}-L${String(ligne.numero).padStart(2, '0')}`,
    })),
  );
  const etatsStock = etatExamples.flatMap((exemple) =>
    Array.from({ length: repetitionsParExemple }, (_, index) => ({
      ...exemple,
      id: idGenere(requiredId(exemple), index),
      date: dateGeneree(exemple.date, index),
      mattes: exemple.mattes + (index % 3) - 1,
    })),
  );
  const mouvements = mouvementExamples.flatMap((exemple) =>
    Array.from({ length: repetitionsParExemple }, (_, index) => ({
      ...exemple,
      id: idGenere(requiredId(exemple), index),
      date: dateGeneree(exemple.date, index),
      poids: exemple.poids + (index % 9) - 4,
      ...(exemple.numeroCoulee
        ? { numeroCoulee: couleeGeneree(exemple.numeroCoulee, index) }
        : {}),
      ...(exemple.numeroLingot !== undefined
        ? { numeroLingot: exemple.numeroLingot + index }
        : {}),
    })),
  );
  const bilans = bilanExamples.flatMap((exemple) =>
    Array.from({ length: repetitionsParExemple }, (_, index) => ({
      ...exemple,
      id: idGenere(requiredId(exemple), index),
      date: dateGeneree(exemple.date, index),
      mattes: exemple.mattes + (index % 3) - 1,
    })),
  );

  await mongoose.connect(uri);
  const LingotModel = mongoose.model(LingotStockRecord.name, LingotStockSchema);
  const LivraisonModel = mongoose.model(
    LivraisonFournisseurRecord.name,
    LivraisonFournisseurSchema,
  );
  const ReceptionModel = mongoose.model(
    ReceptionLingotRecord.name,
    ReceptionLingotSchema,
  );
  const LigneReceptionModel = mongoose.model(
    LigneReceptionLingotRecord.name,
    LigneReceptionLingotSchema,
  );
  const EtatStockModel = mongoose.model(
    EtatStockJournalierRecord.name,
    EtatStockJournalierSchema,
  );
  const MouvementModel = mongoose.model(
    MouvementLingotRecord.name,
    MouvementLingotSchema,
  );
  const BilanModel = mongoose.model(
    BilanLingotsJourRecord.name,
    BilanLingotsJourSchema,
  );

  const idsLingotsActifs = lingots.map((lingot) => lingot.id);
  const anciensIdsLingotsEtiquettes = [
    'NYRSTAR-3031-262208411',
    'BOLIDEN-1253091-B26227F5ZN0065',
    'NYRSTAR-3419-262347109',
    'BOLIDEN-1253103-B26228F5ZN0156',
    'NYRSTAR-3417-262451610',
  ];
  await Promise.all([
    LingotModel.deleteMany({
      id: {
        $in: anciensIdsLingotsEtiquettes.filter(
          (id) => !idsLingotsActifs.includes(id),
        ),
      },
    }),
    LingotModel.deleteMany({ id: /^LINGOT-\d{4}$/ }),
    ...stockExamples.map((exemple) =>
      LingotModel.deleteMany({
        id: {
          $regex: `^${echapperRegex(exemple.id)}-\\d{3}$`,
          $nin: idsLingotsActifs,
        },
      }),
    ),
  ]);

  const operations = [
    ...lingots.map((lingot) =>
      LingotModel.updateOne(
        { id: lingot.id },
        { $set: lingot },
        { upsert: true },
      ),
    ),
    ...livraisons.map((livraison) =>
      LivraisonModel.updateOne(
        { id: requiredId(livraison) },
        { $set: livraison },
        { upsert: true },
      ),
    ),
    ...receptions.map((reception) =>
      ReceptionModel.updateOne(
        { id: reception.id },
        { $set: reception },
        { upsert: true },
      ),
    ),
    ...lignesReception.map((ligne) =>
      LigneReceptionModel.updateOne(
        { id: ligne.id },
        { $set: ligne },
        { upsert: true },
      ),
    ),
    ...etatsStock.map((etat) =>
      EtatStockModel.updateOne(
        { id: requiredId(etat) },
        { $set: etat },
        { upsert: true },
      ),
    ),
    ...mouvements.map((mouvement) =>
      MouvementModel.updateOne(
        { id: requiredId(mouvement) },
        { $set: mouvement },
        { upsert: true },
      ),
    ),
    ...bilans.map((bilan) =>
      BilanModel.updateOne(
        { id: requiredId(bilan) },
        { $set: bilan },
        { upsert: true },
      ),
    ),
  ];

  await Promise.all(operations);
  console.info(
    `Données synchronisées dans ${mongoose.connection.name}: ${lingots.length} lingots, ${livraisons.length} livraisons, ${receptions.length} réceptions, ${lignesReception.length} lignes de réception, ${etatsStock.length} états de stock, ${mouvements.length} mouvements et ${bilans.length} bilans.`,
  );
}

try {
  await seedLingots();
} catch (error) {
  console.error('Échec du peuplement des lingots :', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
