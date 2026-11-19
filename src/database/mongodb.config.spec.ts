import { getLingotsMongoConfig, getMainMongoConfig } from './mongodb.config.js';

const main = 'mongodb://127.0.0.1:27017/app_custom';
const lingots = 'mongodb://127.0.0.1:27017/lingots_custom?authSource=admin';

describe('MongoDB configuration', () => {
  it('uses the database names in the supplied URIs', () => {
    const env = {
      MONGODB_URI: main,
      MONGODB_GESTION_LINGOTS_URI: lingots,
    };

    expect(getMainMongoConfig(env)).toEqual({
      uri: main,
      dbName: 'app_custom',
    });
    expect(getLingotsMongoConfig(env)).toEqual({
      uri: lingots,
      dbName: 'lingots_custom',
    });
  });

  it('does not fall back to the main database', () => {
    expect(() => getLingotsMongoConfig({ MONGODB_URI: main })).toThrow(
      'MONGODB_GESTION_LINGOTS_URI',
    );
  });

  it.each([
    'mongodb://127.0.0.1:27017/?authSource=admin',
    'mongodb://127.0.0.1:27017/gestion_lingots',
    'mongodb://127.0.0.1:27017/admin',
    main,
  ])('refuses unsafe Lingots targets (%s)', (uri) => {
    expect(() =>
      getLingotsMongoConfig({
        MONGODB_URI: main,
        MONGODB_GESTION_LINGOTS_URI: uri,
      }),
    ).toThrow();
  });

  it('refuses the legacy database as a main connection too', () => {
    expect(() =>
      getMainMongoConfig({
        MONGODB_URI: 'mongodb://127.0.0.1:27017/gestion_lingots',
      }),
    ).toThrow('MONGODB_URI cible une base MongoDB réservée');
  });
});
