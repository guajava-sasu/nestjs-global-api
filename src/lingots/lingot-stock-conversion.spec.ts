import { Types } from 'mongoose';
import { describe, expect, it } from 'vitest';
import {
  convertirLingotStock,
  parserDateParis,
  retirerCentiemes,
  type LegacyLingotStockReel,
} from './lingot-stock-conversion.js';

const source: LegacyLingotStockReel = {
  I_LGT_FOU_DATE: '09/04/2026 14:04',
  I_LGT_STK_COUL: 21544,
  I_LGT_STK_NUM: 5,
  D_LGT_STK_PDS: 1975,
  D_LGT_STK_DAT_BAIN: '01/01/1981 00:00',
  D_LGT_STK_POT: 0,
  D_LGT_STK_PREPA: 'XX',
  D_LGT_STK_DAT_MAJ: '10/04/2026 11:07:51:01',
  D_LGT_STK_TYP_APA: 'B ',
};

const fixe = {
  choisir: <T>(valeurs: readonly T[]): T => valeurs[0] as T,
  fournisseurs: [
    { _id: new Types.ObjectId(), nom: 'Boleslaw', code: 'AC123456' },
  ],
  tauxAluminium: [
    { _id: new Types.ObjectId(), nom: 'AL069', couleur: 'orange' },
  ],
  zones: [{
    _id: new Types.ObjectId(),
    code: 'S',
    nom: 'Stock',
    typeOperation: { _id: new Types.ObjectId(), code: 'ST', nom: 'Stockage' },
  }],
};

describe('convertirLingotStock', () => {
  it('convertit un lingot legacy vers le modèle LingotRecord', () => {
    const dateImport = new Date('2026-11-01T00:00:00Z');

    const lingot = convertirLingotStock(source, fixe, dateImport);

    expect(lingot).toMatchObject({
      numeroCoulee: '21544',
      numeroLingot: 5,
      poids: 1975,
      codeQR: 'ZN-AC123456-021544-005-1975-AL069-MG300-09042026',
      fournisseur: fixe.fournisseurs[0],
      tauxAluminium: fixe.tauxAluminium[0],
      dateReception: parserDateParis('09/04/2026 14:04'),
      zone: fixe.zones[0],
      createdAt: dateImport,
      updatedAt: parserDateParis('10/04/2026 11:07:51'),
    });
    expect(lingot._id).toBeInstanceOf(Types.ObjectId);
    expect(lingot).not.toHaveProperty('type');
  });

  it('utilise les choix aléatoires fournis pour fournisseur et taux', () => {
    const dernier = <T>(valeurs: readonly T[]): T =>
      valeurs[valeurs.length - 1] as T;
    const fournisseurs = [
      ...fixe.fournisseurs,
      { _id: new Types.ObjectId(), nom: 'Fournisseur 2', code: 'AC654321' },
    ];
    const tauxAluminium = [
      ...fixe.tauxAluminium,
      { _id: new Types.ObjectId(), nom: 'AL00', couleur: 'blanc' },
    ];
    const lingot = convertirLingotStock(source, {
      ...fixe,
      choisir: dernier,
      fournisseurs,
      tauxAluminium,
    });

    expect(lingot.tauxAluminium.nom).toBe('AL00');
    expect(lingot.fournisseur).toEqual(fournisseurs[1]);
  });

  it('refuse la conversion si aucun fournisseur n’est fourni', () => {
    expect(() => convertirLingotStock(source)).toThrow(
      'Aucun fournisseur disponible dans la base de données.',
    );
  });

  it('parse la date de réception avec fraction de seconde, heure de Paris', () => {
    const lingot = convertirLingotStock(
      { ...source, I_LGT_FOU_DATE: '26/10/2026 08:43:20:983' },
      fixe,
    );

    expect(lingot.dateReception.toISOString()).toBe('2026-10-26T07:43:20.000Z');
  });

  it('retire une fraction de seconde de 1 à 3 chiffres', () => {
    expect(retirerCentiemes('10/04/2026 11:07:51:01')).toBe(
      '10/04/2026 11:07:51',
    );
    expect(retirerCentiemes('10/04/2026 11:07:37:546')).toBe(
      '10/04/2026 11:07:37',
    );
    expect(retirerCentiemes('10/04/2026 11:07:29:5')).toBe(
      '10/04/2026 11:07:29',
    );
  });

  it('refuse la conversion si aucun taux n’est fourni', () => {
    expect(() =>
      convertirLingotStock(source, { ...fixe, tauxAluminium: [] }),
    ).toThrow("Aucun taux d'aluminium disponible dans la base de données.");
  });
});
