import mongoose from 'mongoose';
import {
  FournisseurRecord,
  FournisseurSchema,
  LingotRecord,
  LingotSchema,
  TauxAluminiumRecord,
  TauxAluminiumSchema,
  ZoneRecord,
  ZoneSchema,
} from './entities/lingot.entity.js';
import {
  importerLingotsStock,
  type LegacyLingotStockReel,
} from './lingot-stock-conversion.js';
import { LINGOTS_DATABASE_NAME } from './lingots.constants.js';

const uri =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nestjs-global-api';
const lingotsUri =
  process.env.MONGODB_GESTION_LINGOTS_URI ??
  process.env.MONGODB_URI ??
  'mongodb://localhost:27017/nestjs-global-api';
const collectionSource = 'lingot-stock-reel-source';
const collectionCible = 'lingots';
let lingotsConnection: mongoose.Connection | undefined;

try {
  await mongoose.connect(uri);

  const targetConnection = await mongoose
    .createConnection(lingotsUri, { dbName: LINGOTS_DATABASE_NAME })
    .asPromise();
  lingotsConnection = targetConnection;
  const FournisseurModel = targetConnection.model(
    FournisseurRecord.name,
    FournisseurSchema,
  );
  const TauxModel = targetConnection.model(
    TauxAluminiumRecord.name,
    TauxAluminiumSchema,
  );
  const ZoneModel = targetConnection.model(ZoneRecord.name, ZoneSchema);
  const LingotModel = targetConnection.model(LingotRecord.name, LingotSchema);
  const [fournisseurs, tauxAluminium, zones] = await Promise.all([
    FournisseurModel.find().lean().exec(),
    TauxModel.find().lean().exec(),
    ZoneModel.find().lean().exec(),
  ]);
  if (!fournisseurs.length || !tauxAluminium.length || !zones.length) {
    throw new Error(
      `Les référentiels de ${LINGOTS_DATABASE_NAME} doivent être chargés.`,
    );
  }

  const sources = mongoose.connection
    .collection<LegacyLingotStockReel>(collectionSource)
    .find({});

  const rapport = await importerLingotsStock(sources, LingotModel, {
    fournisseurs,
    tauxAluminium,
    zones,
  });

  for (const erreur of rapport.erreurs) {
    console.warn(`Ignoré : ${erreur}`);
  }
  console.info(
    `Conversion ${collectionSource} → ${collectionCible} : ${rapport.lus} lus, ${rapport.importes} écrits, ${rapport.ignores} ignorés.`,
  );
} catch (error) {
  console.error('Échec de la conversion des lingots stock :', error);
  process.exitCode = 1;
} finally {
  await Promise.all([
    mongoose.disconnect(),
    lingotsConnection?.close() ?? Promise.resolve(),
  ]);
}
