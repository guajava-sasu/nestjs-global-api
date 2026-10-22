import mongoose from 'mongoose';
import {
  LingotStockRecord,
  LingotStockSchema,
  TypeLingot,
} from './entities/lingot.entity.js';

const uri =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nestjs-global-api';
const fournisseurs = [
  'Budel Zink',
  'BOLIDEN',
  'Glencore',
  'Vedanta ',
  'Nexa Resources',
];
const types: TypeLingot[] = ['B', 'OB', 'VB', 'BB', 'N'];

async function seedLingots() {
  await mongoose.connect(uri);
  const LingotModel = mongoose.model(LingotStockRecord.name, LingotStockSchema);

  const operations = Array.from({ length: 100 }, (_, index) => {
    const numeroLingot = index + 1;
    const type = types[index % types.length];
    const numeroCoulee = `COU-2026-${String(Math.floor(index / 10) + 1).padStart(3, '0')}`;
    const lingot = {
      id: `LINGOT-${String(numeroLingot).padStart(4, '0')}`,
      poids: 650 + ((index * 37) % 201),
      fournisseur: fournisseurs[Math.floor(index / 20)],
      numeroCoulee,
      valide: index % 10 !== 9,
      numeroLingot,
      alFournisseur: Number((99.1 + (index % 9) * 0.1).toFixed(1)),
      alArcelor: Number((99.0 + (index % 8) * 0.1).toFixed(1)),
      dateReception: new Date(Date.UTC(2026, 0, 1 + (index % 90))),
      type,
      ...(index % 3 === 0 ? { preparation: 'Nettoyage standard' } : {}),
    };

    return LingotModel.updateOne(
      { id: lingot.id },
      { $set: lingot },
      { upsert: true },
    );
  });

  await Promise.all(operations);
  console.info(
    `100 lingots de test insérés ou mis à jour dans ${mongoose.connection.name}.`,
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
