import mongoose from 'mongoose';
import {
  FournisseurRecord,
  FournisseurSchema,
  PositionRecord,
  PositionSchema,
  TauxAluminiumRecord,
  TauxAluminiumSchema,
} from './entities/lingot.entity.js';
import { LINGOTS_DATABASE_NAME } from './lingots.constants.js';

const uri =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nestjs-global-api';

const fournisseurs = [
  { id: 'BOLIDEN', nom: 'Boliden', code: 'BOLIDEN' },
  { id: 'GLENCORE', nom: 'Glencore plc', code: 'GLENCORE' },
  { id: 'NYRSTAR', nom: 'Nyrstar', code: 'NYRSTAR' },
  {
    id: 'TECK-RESOURCES',
    nom: 'Teck Resources Limited',
    code: 'TECK',
  },
  { id: 'LUNDIN-MINING', nom: 'Lundin Mining', code: 'LUNDIN' },
];

const positions = [
  { id: 'POSITION-OPERATEUR-1', nom: 'Position operateur 1', code: 'PO1' },
  { id: 'POSITION-OPERATEUR-2', nom: 'Position operateur 2', code: 'PO2' },
  { id: 'POSITION-MOTEUR-1', nom: 'Position moteur 1', code: 'PM1' },
  { id: 'POSITION-MOTEUR-2', nom: 'Position moteur 2', code: 'PM2' },
  { id: 'COULEE-OPERATEUR', nom: 'Coulée Opérateur', code: 'CO' },
  { id: 'COULEE-MOTEUR', nom: 'Coulée moteur', code: 'CM' },
  { id: 'EN-STOCK', nom: 'En stock', code: 'Stock' },
  {
    id: 'TRANSFERT-GALMA1',
    nom: 'Transfert halle vers GALMA1',
    code: 'GALMA1',
  },
];

const tauxAluminium = [
  { id: 'AL069', nom: 'AL069', couleur: 'orange' },
  { id: 'AL039', nom: 'AL039', couleur: 'bleu' },
  { id: 'AL00', nom: 'AL00', couleur: 'blanc' },
];

async function seedLingotReferences() {
  await mongoose.connect(uri, { dbName: LINGOTS_DATABASE_NAME });

  const FournisseurModel = mongoose.model(
    FournisseurRecord.name,
    FournisseurSchema,
  );
  const PositionModel = mongoose.model(PositionRecord.name, PositionSchema);
  const TauxAluminiumModel = mongoose.model(
    TauxAluminiumRecord.name,
    TauxAluminiumSchema,
  );

  await Promise.all([
    ...fournisseurs.map((fournisseur) =>
      FournisseurModel.updateOne(
        { id: fournisseur.id },
        { $set: fournisseur },
        { upsert: true },
      ),
    ),
    ...positions.map((position) =>
      PositionModel.updateOne(
        { id: position.id },
        { $set: position },
        { upsert: true },
      ),
    ),
    ...tauxAluminium.map((taux) =>
      TauxAluminiumModel.updateOne(
        { id: taux.id },
        { $set: taux },
        { upsert: true },
      ),
    ),
  ]);

  console.info(
    `Référentiels synchronisés dans ${mongoose.connection.name}: ${fournisseurs.length} fournisseurs, ${positions.length} positions et ${tauxAluminium.length} taux d'aluminium.`,
  );
}

try {
  await seedLingotReferences();
} catch (error) {
  console.error('Échec du seed des référentiels lingots :', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
