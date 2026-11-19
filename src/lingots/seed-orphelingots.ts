import mongoose, { Types } from 'mongoose';
import {
  OrphelingotSchema,
  type TauxAluminium,
  type Zone,
} from './entities/lingot.entity.js';
import { getLingotsMongoConfig } from '../database/mongodb.config.js';
const nombreLingots = 20;

async function seedOrphelingots(): Promise<void> {
  await mongoose.connect(getLingotsMongoConfig().uri);
  try {
    const tauxAluminium = (await mongoose.connection
      .collection('taux-aluminium-lingots')
      .findOne({ nom: 'AL00' })) as unknown as TauxAluminium | null;
    const zone = (await mongoose.connection
      .collection('zones-lingots')
      .findOne({ code: 'S' })) as unknown as Zone | null;

    if (!tauxAluminium || !zone) {
      throw new Error('Le taux AL00 ou la zone Stock est absent de la base.');
    }

    const OrphelingotModel = mongoose.model(
      'OrphelingotSeed',
      OrphelingotSchema,
    );
    await OrphelingotModel.init();

    const lingots = Array.from({ length: nombreLingots }, (_, index) => {
      const numeroLingot = index + 1;
      const suffixe = String(numeroLingot).padStart(3, '0');
      return {
        _id: new Types.ObjectId(
          `6f000000000000000000${String(numeroLingot).padStart(4, '0')}`,
        ),
        codeQR: `ORPHE-AL00-${suffixe}`,
        fournisseur: {
          _id: new Types.ObjectId('6e0000000000000000000001'),
          nom: 'Démonstration',
          code: 'AC000000',
        },
        numeroCoulee: 'ORPHE-AL00',
        numeroLingot,
        poids: 1900 + index * 7,
        tauxAluminium,
        dateReception: new Date(Date.UTC(2026, 0, numeroLingot)),
        zone,
      };
    });

    await OrphelingotModel.bulkWrite(
      lingots.map((lingot) => ({
        replaceOne: {
          filter: { codeQR: lingot.codeQR },
          replacement: lingot,
          upsert: true,
        },
      })),
      { ordered: true },
    );

    console.info(
      `${lingots.length} lingots AL00 de démonstration synchronisés dans orphelingots.`,
    );
  } finally {
    await mongoose.disconnect();
  }
}

try {
  await seedOrphelingots();
} catch (error) {
  console.error('Échec du seed orphelingots :', error);
  process.exitCode = 1;
  await mongoose.disconnect();
}