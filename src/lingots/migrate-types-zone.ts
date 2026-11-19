import mongoose from 'mongoose';
import { getLingotsMongoConfig } from '../database/mongodb.config.js';
import { TypeZoneRecord, TypeZoneSchema } from './entities/lingot.entity.js';
import { CODE_TYPE_PAR_ZONE, TYPES_ZONE } from './types-zone.js';

const emplacements = [
  ['zones-lingots', ''],
  ['lingots', 'zone.'],
  ['orphelingots', 'zone.'],
  ['mouvements-lingots', 'depart.'],
  ['mouvements-lingots', 'arrivee.'],
  ['mouvements-lingots', 'lingot.zone.'],
] as const;

const { uri, dbName } = getLingotsMongoConfig();
try {
  await mongoose.connect(uri);
  const db = mongoose.connection.db!;
  const TypesZone = mongoose.model(TypeZoneRecord.name, TypeZoneSchema);
  await TypesZone.init();
  for (const { code, nom } of TYPES_ZONE) {
    const type = await TypesZone.findOneAndUpdate(
      { code },
      { $setOnInsert: { code, nom } },
      { upsert: true, returnDocument: 'after', runValidators: true },
    ).orFail().lean().exec();
    const snapshot = { _id: type._id, code: type.code, nom: type.nom };
    const codes = Object.keys(CODE_TYPE_PAR_ZONE).filter(
      zone => CODE_TYPE_PAR_ZONE[zone] === code,
    );

    for (const [collection, prefix] of emplacements) {
      await db.collection(collection).updateMany(
        { [`${prefix}code`]: { $in: codes }, [`${prefix}typeOperation`]: null },
        { $set: { [`${prefix}typeOperation`]: snapshot } },
      );
    }

    await db.collection('inventaires-lingots').updateMany(
      { lingots: { $elemMatch: { 'zone.code': { $in: codes }, 'zone.typeOperation': null } } },
      { $set: { 'lingots.$[lingot].zone.typeOperation': snapshot } },
      { arrayFilters: [{ 'lingot.zone.code': { $in: codes }, 'lingot.zone.typeOperation': null }] },
    );
  }

  const lignesRestantes = await Promise.all(emplacements.map(async ([collection, prefix]) => {
    const count = await db.collection(collection).countDocuments({
      [`${prefix}code`]: { $exists: true },
      [`${prefix}typeOperation`]: null,
    });
    return count ? `${collection}.${prefix}typeOperation (${count})` : null;
  }));
  const inventairesRestants = await db.collection('inventaires-lingots').countDocuments({
    lingots: { $elemMatch: { 'zone.code': { $exists: true }, 'zone.typeOperation': null } },
  });
  if (inventairesRestants) lignesRestantes.push(`inventaires-lingots (${inventairesRestants})`);
  const reste = lignesRestantes.filter(Boolean);
  if (reste.length) throw new Error(`Zones sans classement à traiter : ${reste.join(', ')}.`);
  console.info(`Référentiel TypeZone et zones existantes mis à jour dans ${dbName}.`);
} finally {
  await mongoose.disconnect();
}
