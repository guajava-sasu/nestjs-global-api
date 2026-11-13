import mongoose, { Types } from 'mongoose';
import {
  InventaireRecord,
  InventaireSchema,
  LingotRecord,
  LingotSchema,
  type Operateur,
} from './entities/lingot.entity.js';
import { LINGOTS_DATABASE_NAME } from './lingots.constants.js';

const uri =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nestjs-global-api';
const nombreInventaires = 50;
const codeOperateurSeed = 'SEED-INVENTAIRES-50';
const uneJourneeMs = 24 * 60 * 60 * 1000;

async function seedInventaires(): Promise<void> {
  await mongoose.connect(uri, { dbName: LINGOTS_DATABASE_NAME });
  try {
    const InventaireModel = mongoose.model(
      InventaireRecord.name,
      InventaireSchema,
    );
    const LingotModel = mongoose.model(LingotRecord.name, LingotSchema);
    const dejaCrees = await InventaireModel.countDocuments({
      'operateur.codeQR': {
        $regex: `^${codeOperateurSeed}(?:-|$)`,
      },
    });
    const restant = Math.max(0, nombreInventaires - dejaCrees);

    if (restant === 0) {
      console.info(
        `${nombreInventaires} inventaires de démonstration existent déjà.`,
      );
      return;
    }

    const lingots = await LingotModel.find().lean().exec();
    if (lingots.length === 0) {
      throw new Error(
        'Aucun lingot en base : exécutez d’abord le seed gestion-lingots.',
      );
    }

    const operateur: Operateur = {
      _id: new Types.ObjectId(),
      username: 'seed.inventaires',
      entreprise: 'ArcelorMittal',
      nom: 'Démonstration',
      prenom: 'Données',
      codeQR: codeOperateurSeed,
    };
    const maintenant = new Date();
    maintenant.setHours(8, 0, 0, 0);

    const inventaires = Array.from({ length: restant }, (_, offset) => {
      const index = dejaCrees + offset;
      const debut = (index * 7) % lingots.length;
      const nombreLingots = Math.min(5 + (index % 6), lingots.length);

      return {
        date: new Date(
          maintenant.getTime() - (nombreInventaires - 1 - index) * uneJourneeMs,
        ),
        operateur: {
          ...operateur,
          codeQR: `${codeOperateurSeed}-${String(index + 1).padStart(3, '0')}`,
        },
        lingots: Array.from(
          { length: nombreLingots },
          (_, position) => lingots[(debut + position) % lingots.length]!,
        ),
      };
    });

    await InventaireModel.insertMany(inventaires);
    console.info(
      `${inventaires.length} inventaires ajoutés à ${LINGOTS_DATABASE_NAME}.`,
    );
  } finally {
    await mongoose.disconnect();
  }
}

try {
  await seedInventaires();
} catch (error) {
  console.error('Échec du seed des inventaires :', error);
  process.exitCode = 1;
  await mongoose.disconnect();
}
