import mongoose from 'mongoose';
import { readFile } from 'node:fs/promises';
import type {
  BilanLingotsJour,
  EtatStockJournalier,
  LingotStock,
  LivraisonFournisseur,
  MouvementLingot,
  OperateurTracker,
  ReceptionLingot,
  TypeLingot,
  Zone,
} from './entities/lingot.entity.js';
import {
  BilanLingotsJourRecord,
  BilanLingotsJourSchema,
  couleursZoneAutorisees,
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
  OperateurTrackerRecord,
  OperateurTrackerSchema,
  ReceptionLingotRecord,
  ReceptionLingotSchema,
  ZoneRecord,
  ZoneSchema,
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
const typesLingot: TypeLingot[] = ['B', 'OB', 'VB', 'BB', 'N'];
const fournisseursLingots = [
  'BOLESLAW',
  'BOLIDEN',
  'GLENCORE',
  'NEXA',
  'TRAFIGUR',
];
const postesPreparation = ['PM1', 'PM2', 'PO1'];
const dateFinJeu = new Date();
dateFinJeu.setUTCHours(6, 0, 0, 0);
const dateDebutJeu = new Date(
  dateFinJeu.getTime() - (repetitionsParExemple - 1) * jourEnMs,
);

const operateursDeTrack: OperateurTracker[] = [
  {
    id: 'operateur-1',
    username: 'marie.dupont',
    entreprise: 'N3 Electryck',
    nom: 'Dupont',
    prenom: 'Marie',
  },
  {
    id: 'operateur-2',
    username: 'julien.martin',
    entreprise: 'Mardyck Services',
    nom: 'Martin',
    prenom: 'Julien',
  },
  {
    id: 'operateur-3',
    username: 'camille.lefevre',
    entreprise: 'N3 Electryck',
    nom: 'Lefèvre',
    prenom: 'Camille',
  },
  {
    id: 'operateur-4',
    username: 'sophie.moreau',
    entreprise: 'ArcelorMittal',
    nom: 'Moreau',
    prenom: 'Sophie',
  },
  ...Array.from({ length: 46 }, (_, index): OperateurTracker => {
    const prenoms = [
      'Thomas',
      'Claire',
      'Nicolas',
      'Emma',
      'Lucas',
      'Léa',
      'Antoine',
      'Sarah',
      'Hugo',
      'Manon',
    ];
    const noms = ['Bernard', 'Petit', 'Robert', 'Richard', 'Durand'];
    const entreprises = ['N3 Electryck', 'Mardyck Services', 'ArcelorMittal'];
    const prenom = prenoms[index % prenoms.length];
    const nom = noms[Math.floor(index / prenoms.length)];
    const username = `${prenom}.${nom}`
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    return {
      id: `operateur-${index + 5}`,
      username,
      entreprise: entreprises[index % entreprises.length],
      nom,
      prenom,
    };
  }),
];

const zonesSansCouleur: Omit<Zone, 'couleur'>[] = [
  { id: 1, nom: 'Réception matières', code: 'REC' },
  { id: 2, nom: 'Stock lingots', code: 'STO' },
  { id: 3, nom: 'Préparation', code: 'PRE' },
  { id: 4, nom: 'Fusion', code: 'FUS' },
  { id: 5, nom: 'Analyse', code: 'ANA' },
  { id: 6, nom: 'Contrôle qualité', code: 'QUA' },
  { id: 7, nom: 'Expédition', code: 'EXP' },
  { id: 8, nom: 'Contrôle dimensionnel', code: 'DIM' },
  { id: 9, nom: 'Four', code: 'FOU' },
  { id: 10, nom: 'Refroidissement', code: 'REF' },
  { id: 11, nom: 'Parc extérieur', code: 'PAR' },
  { id: 12, nom: 'Maintenance', code: 'MAI' },
  { id: 13, nom: 'Conditionnement', code: 'CON' },
  { id: 14, nom: 'Laboratoire', code: 'LAB' },
  { id: 15, nom: 'Zone déchets', code: 'DEC' },
];

const zones: Zone[] = zonesSansCouleur.map((zone, index) => ({
  ...zone,
  couleur:
    couleursZoneAutorisees[index % couleursZoneAutorisees.length] ??
    couleursZoneAutorisees[0],
}));

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
    Array.from({ length: repetitionsParExemple }, (_, index) => {
      const valide = index % 11 !== 5;
      const alFournisseur = Number((99.51 + (index % 8) * 0.035).toFixed(3));
      const lingot: LingotStock = {
        ...exemple,
        id: idGenere(exemple.id, index),
        numeroLingot: (index % 10) + 1,
        numeroCoulee: couleeGeneree(
          exemple.numeroCoulee,
          Math.floor(index / 10),
        ),
        poids: 1980 + ((index * 17) % 41),
        fournisseur:
          fournisseursLingots[index % fournisseursLingots.length] ?? 'BOLIDEN',
        valide,
        alFournisseur,
        alArcelor: valide
          ? Number((alFournisseur + ((index % 3) - 1) * 0.006).toFixed(3))
          : 0,
        dateReception: dateGeneree(
          dateFinJeu,
          -Math.floor((repetitionsParExemple - index - 1) / 5),
        ),
        type: typesLingot[index % typesLingot.length] ?? 'B',
      };

      if (index < postesPreparation.length) {
        lingot.preparation = postesPreparation[index] ?? 'PM1';
      } else {
        delete lingot.preparation;
      }

      return lingot;
    }),
  );
  const livraisons = livraisonExamples.flatMap((exemple) =>
    Array.from({ length: repetitionsParExemple }, (_, index) => ({
      ...exemple,
      id: idGenere(requiredId(exemple), index),
      numeroCoulee: couleeGeneree(exemple.numeroCoulee, index),
      dateLivraison: dateGeneree(dateDebutJeu, index),
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
        dateReception: dateGeneree(dateDebutJeu, index),
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
    Array.from({ length: repetitionsParExemple }, (_, index) => {
      const parType: EtatStockJournalier['parType'] = {};

      typesLingot.forEach((type, typeIndex) => {
        const reference = exemple.parType[type];
        if (!reference) return;

        const phase = typeIndex * 1.7;
        const variationNombre = Math.round(
          1.5 * (Math.sin(index * 0.55 + phase) - Math.sin(phase)),
        );
        const nombre = Math.max(0, reference.nombre + variationNombre);
        const poidsMoyen = reference.poids / reference.nombre;
        const variationPoids =
          0.08 * (Math.sin(index * 0.8 + phase) - Math.sin(phase));

        parType[type] = {
          nombre,
          poids: Number((nombre * poidsMoyen + variationPoids).toFixed(2)),
        };
      });

      return {
        ...exemple,
        id: idGenere(requiredId(exemple), index),
        date: dateGeneree(dateDebutJeu, index),
        parType,
        mattes: Math.max(
          0,
          exemple.mattes + (index === 0 ? 0 : (index % 3) - 1),
        ),
      };
    }),
  );
  const mouvementLingot = mouvementExamples.find(
    (exemple) => exemple.type !== 'MATTE',
  );
  const mouvementMatte = mouvementExamples.find(
    (exemple) => exemple.type === 'MATTE',
  );
  if (!mouvementLingot || !mouvementMatte) {
    throw new Error('Les exemples doivent contenir un lingot et une matte.');
  }

  let nombreMouvementsLingot = 0;
  let nombreMouvementsMatte = 0;
  const postesMouvement = ['PONT-01', 'PONT-02'];
  const mouvements: MouvementLingot[] = Array.from(
    { length: repetitionsParExemple * 2 },
    (_, index) => {
      const estMatte = index % 20 === 19;
      const exemple = estMatte ? mouvementMatte : mouvementLingot;
      const indexExemple = estMatte
        ? nombreMouvementsMatte++
        : nombreMouvementsLingot++;
      const date = dateGeneree(dateDebutJeu, Math.floor(index / 2));
      date.setUTCHours(
        estMatte ? 11 : index % 2 === 0 ? 9 : 10,
        estMatte ? 0 : 25,
        0,
        0,
      );

      if (estMatte) {
        return {
          ...exemple,
          id: idGenere(requiredId(exemple), indexExemple),
          date,
          poids: 998 + (indexExemple % 5),
          poste: 'FOUR-02',
          type: 'MATTE',
          table: `T-0${(indexExemple % 4) + 1}`,
          creuset: `CR-${String(4 + (indexExemple % 9)).padStart(2, '0')}`,
        };
      }

      return {
        ...exemple,
        id: idGenere(requiredId(exemple), indexExemple),
        date,
        poste:
          postesMouvement[indexExemple % postesMouvement.length] ?? 'PONT-01',
        type: typesLingot[indexExemple % typesLingot.length] ?? 'B',
        numeroCoulee: couleeGeneree(
          mouvementLingot.numeroCoulee ?? '',
          Math.floor(indexExemple / 5),
        ),
        numeroLingot: (indexExemple % 10) + 1,
        poids: 1910 + ((indexExemple * 29) % 95),
        al: Number((99.48 + (indexExemple % 9) * 0.035).toFixed(3)),
        table: `T-0${(indexExemple % 4) + 1}`,
        creuset: `CR-${String(4 + (indexExemple % 9)).padStart(2, '0')}`,
      };
    },
  );
  const bilans = bilanExamples.flatMap((exemple) =>
    Array.from({ length: repetitionsParExemple }, (_, index) => ({
      ...exemple,
      id: idGenere(requiredId(exemple), index),
      date: dateGeneree(dateDebutJeu, index),
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
  const OperateurTrackerModel = mongoose.model(
    OperateurTrackerRecord.name,
    OperateurTrackerSchema,
  );
  const ZoneModel = mongoose.model(ZoneRecord.name, ZoneSchema);

  const idsLingotsActifs = lingots.map((lingot) => lingot.id);
  const idsMouvementsActifs = mouvements.map((mouvement) =>
    requiredId(mouvement),
  );
  const anciensIdsLingotsEtiquettes = [
    'NYRSTAR-3031-262208411',
    'BOLIDEN-1253091-B26227F5ZN0065',
    'NYRSTAR-3419-262347109',
    'BOLIDEN-1253103-B26228F5ZN0156',
    'NYRSTAR-3417-262451610',
  ];
  await Promise.all([
    ...anciensIdsLingotsEtiquettes.map((id) =>
      LingotModel.deleteMany({
        id: {
          $regex: `^${echapperRegex(id)}(?:-[0-9]{2})?(?:-[0-9]{3})?$`,
          $nin: idsLingotsActifs,
        },
      }),
    ),
    LingotModel.deleteMany({ id: /^LINGOT-\d{4}$/ }),
    ...stockExamples.map((exemple) =>
      LingotModel.deleteMany({
        id: {
          $regex: `^${echapperRegex(exemple.id)}-\\d{3}$`,
          $nin: idsLingotsActifs,
        },
      }),
    ),
    ...mouvementExamples.map((exemple) =>
      MouvementModel.deleteMany({
        id: {
          $regex: `^${echapperRegex(requiredId(exemple))}(?:-\\d{3})?$`,
          $nin: idsMouvementsActifs,
        },
      }),
    ),
  ]);

  const operations = [
    ...lingots.map((lingot) =>
      LingotModel.updateOne(
        { id: lingot.id },
        {
          $set: lingot,
          ...(!lingot.preparation ? { $unset: { preparation: 1 } } : {}),
        },
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
    ...operateursDeTrack.map((operateur) =>
      OperateurTrackerModel.updateOne(
        { id: operateur.id },
        { $set: operateur },
        { upsert: true },
      ),
    ),
    ...zones.map((zone) =>
      ZoneModel.updateOne({ id: zone.id }, { $set: zone }, { upsert: true }),
    ),
  ];

  await Promise.all(operations);
  console.info(
    `Données synchronisées dans ${mongoose.connection.name}: ${lingots.length} lingots, ${livraisons.length} livraisons, ${receptions.length} réceptions, ${lignesReception.length} lignes de réception, ${etatsStock.length} états de stock, ${mouvements.length} mouvements, ${bilans.length} bilans, ${operateursDeTrack.length} opérateurs et ${zones.length} zones.`,
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
