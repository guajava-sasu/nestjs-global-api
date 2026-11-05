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
const collectionSource = 'lingot-stock-reel-source';
const collectionCible = 'lingots';

try {
  await mongoose.connect(uri);

  const lingotsConnection = mongoose.connection.useDb(LINGOTS_DATABASE_NAME, {
    useCache: true,
  });
  const FournisseurModel = lingotsConnection.model(
    FournisseurRecord.name,
    FournisseurSchema,
  );
  const TauxModel = lingotsConnection.model(
    TauxAluminiumRecord.name,
    TauxAluminiumSchema,
  );
  const ZoneModel = lingotsConnection.model(ZoneRecord.name, ZoneSchema);
  const LingotModel = lingotsConnection.model(LingotRecord.name, LingotSchema);
  const [fournisseurs, tauxAluminium, zones] = await Promise.all([
    FournisseurModel.find().lean().exec(),
    TauxModel.find().lean().exec(),
    ZoneModel.find().lean().exec(),
  ]);
  if (!fournisseurs.length || !tauxAluminium.length || !zones.length) {
    throw new Error('Les référentiels de gestion_lingots doivent être chargés.');
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
  await mongoose.disconnect();
}
