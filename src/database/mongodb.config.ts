import mongoose from 'mongoose';
import { loadEnvFile } from 'node:process';

try {
  loadEnvFile();
} catch (error) {
  if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
    throw error;
  }
}

type MongoUriVariable = 'MONGODB_URI' | 'MONGODB_GESTION_LINGOTS_URI';

function readMongoConfig(variable: MongoUriVariable, env: NodeJS.ProcessEnv) {
  const uri = env[variable]?.trim();
  if (!uri || !/^mongodb(?:\+srv)?:\/\/[^/?#]+\/[^/?#]+(?:\?|$)/i.test(uri)) {
    throw new Error(
      `${variable} doit contenir une URI MongoDB avec un nom de base explicite.`,
    );
  }

  let dbName: string;
  try {
    dbName = new mongoose.mongo.MongoClient(uri).options.dbName;
  } catch {
    throw new Error(`${variable} contient une URI MongoDB invalide.`);
  }

  if (
    ['admin', 'config', 'local', 'gestion_lingots'].includes(
      dbName.toLowerCase(),
    )
  ) {
    throw new Error(`${variable} cible une base MongoDB réservée.`);
  }
  return { uri, dbName };
}

export function getMainMongoConfig(env = process.env) {
  return readMongoConfig('MONGODB_URI', env);
}

export function getLingotsMongoConfig(env = process.env) {
  const lingots = readMongoConfig('MONGODB_GESTION_LINGOTS_URI', env);
  if (
    lingots.dbName.toLowerCase() === getMainMongoConfig(env).dbName.toLowerCase()
  ) {
    throw new Error(
      'Les connexions MongoDB principale et lingots doivent cibler des noms de base distincts.',
    );
  }
  return lingots;
}
