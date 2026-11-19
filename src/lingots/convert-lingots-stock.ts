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
import {
  getLingotsMongoConfig,
  getMainMongoConfig,
} from '../database/mongodb.config.js';

const collectionSource = 'lingot-stock-reel-source';
const collectionCible = 'lingots';
let lingotsConnection: mongoose.Connection | undefined;

try {
  const { uri: lingotsUri, dbName } = getLingotsMongoConfig();
  await mongoose.connect(getMainMongoConfig().uri);

  const targetConnection = await mongoose
    .createConnection(lingotsUri)
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
      `Les référentiels de ${dbName} doivent être chargés.`,
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
