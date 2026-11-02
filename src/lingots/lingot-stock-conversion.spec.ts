import { describe, expect, it } from 'vitest';
import {
  convertirLingotStock,
  parserDateParis,
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

describe('convertirLingotStock', () => {
  const dateImport = new Date('2026-10-30T13:00:00.000Z');

  it('convertit un enregistrement de l’ancien modèle', () => {
    expect(convertirLingotStock(source, undefined, dateImport)).toEqual({
      id: 'NYRSTAR-3031-21544-005',
      poids: 1975,
      fournisseur: 'NON RENSEIGNE',
      numeroCoulee: '21544',
      valide: false,
      numeroLingot: 5,
      alFournisseur: 0,
      alArcelor: 0,
      dateReception: new Date('2026-04-09T12:04:00.000Z'),
      type: 'B',
      createdAt: dateImport,
      updatedAt: new Date('2026-04-10T09:07:51.000Z'),
    });
  });

  it('accepte une fraction de seconde de 1 à 3 chiffres dans les dates source', () => {
    expect(
      convertirLingotStock({
        ...source,
        I_LGT_FOU_DATE: '26/10/2026 08:43:20:983',
      }).dateReception,
    ).toEqual(new Date('2026-10-26T07:43:20.000Z'));
    expect(
      convertirLingotStock({
        ...source,
        D_LGT_STK_DAT_MAJ: '08/10/2026 11:03:37:546',
      }).updatedAt,
    ).toEqual(new Date('2026-10-08T09:03:37.000Z'));
    expect(
      convertirLingotStock({
        ...source,
        D_LGT_STK_DAT_MAJ: '29/09/2026 11:11:29:5',
      }).updatedAt,
    ).toEqual(new Date('2026-09-29T09:11:29.000Z'));
  });

  it('rejette un type de lingot inconnu', () => {
    expect(() =>
      convertirLingotStock({ ...source, D_LGT_STK_TYP_APA: 'XX' }),
    ).toThrow('Type de lingot inconnu');
  });
});

describe('parserDateParis', () => {
  it('applique l’heure d’hiver en janvier', () => {
    expect(parserDateParis('15/01/2026 10:00')).toEqual(
      new Date('2026-01-15T09:00:00.000Z'),
    );
  });
});
