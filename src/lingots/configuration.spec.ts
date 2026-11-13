import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { model } from 'mongoose';
import { describe, expect, it } from 'vitest';
import {
  CreateConfigurationDto,
  UpdateConfigurationDto,
} from './dto/lingot.dto.js';
import { ConfigurationSchema } from './entities/lingot.entity.js';

const Configuration = model('ConfigurationTest', ConfigurationSchema);

describe('Configuration', () => {
  it('utilise la collection configuration et une cle unique', () => {
    expect(ConfigurationSchema.get('collection')).toBe('configuration');
    expect(ConfigurationSchema.indexes()).toContainEqual([
      { cle: 1 },
      { unique: true },
    ]);
  });

  it.each([100, 0, false, 'stock', { limite: 100 }, ['S', 'F']])(
    'accepte une valeur de configuration %j',
    async (valeur) => {
      const configuration = new Configuration({
        cle: 'nombreLingotsMaximum',
        valeur,
      });
      await expect(configuration.validate()).resolves.toBeUndefined();
      expect(configuration.valeur).toEqual(valeur);
    },
  );

  it.each([
    { cle: '', valeur: 100 },
    { cle: '   ', valeur: 100 },
    { valeur: 100 },
    { cle: 'nombreLingotsMaximum' },
    { cle: 'nombreLingotsMaximum', valeur: null },
  ])('refuse un parametre incomplet %j', async (data) => {
    await expect(new Configuration(data).validate()).rejects.toThrow();
  });

  it.each([0, false, 100, 'stock', { limite: 100 }, ['S', 'F']])(
    'conserve la valeur %j avec la validation HTTP',
    async (valeur) => {
      const data = plainToInstance(CreateConfigurationDto, {
        cle: 'nombreLingotsMaximum',
        valeur,
      });
      expect(await validate(data, { whitelist: true })).toEqual([]);
      expect(data.valeur).toEqual(valeur);
    },
  );

  it.each([
    { cle: ' ', valeur: 100 },
    { cle: 'nombreLingotsMaximum' },
    { cle: 'nombreLingotsMaximum', valeur: null },
  ])('refuse un corps HTTP incomplet %j', async (data) => {
    expect(
      await validate(plainToInstance(CreateConfigurationDto, data)),
    ).not.toEqual([]);
  });

  it('permet de modifier uniquement la valeur', async () => {
    const data = plainToInstance(UpdateConfigurationDto, { valeur: 200 });
    expect(await validate(data, { whitelist: true })).toEqual([]);
    expect(data.valeur).toBe(200);
  });
});