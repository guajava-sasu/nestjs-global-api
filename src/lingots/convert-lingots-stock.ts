import mongoose from 'mongoose';
import {
  LingotStockRecord,
  LingotStockSchema,
} from './entities/lingot.entity.js';
import {
  importerLingotsStock,
  type LegacyLingotStockReel,
} from './lingot-stock-conversion.js';

const uri =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nestjs-global-api';
const collectionSource = 'lingot-stock-reel-source';

try {
  await mongoose.connect(uri);

  const LingotModel = mongoose.model(LingotStockRecord.name, LingotStockSchema);
  const sources = mongoose.connection
    .collection<LegacyLingotStockReel>(collectionSource)
    .find({});

  const rapport = await importerLingotsStock(sources, LingotModel);

  for (const erreur of rapport.erreurs) {
    console.warn(`Ignoré : ${erreur}`);
  }
  console.info(
    `Conversion ${collectionSource} → lingots-stock : ${rapport.lus} lus, ${rapport.importes} écrits, ${rapport.ignores} ignorés.`,
  );
} catch (error) {
  console.error('Échec de la conversion des lingots stock :', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
