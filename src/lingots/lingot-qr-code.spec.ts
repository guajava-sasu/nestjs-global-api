import { describe, expect, it } from 'vitest';
import { genererCodeQrLingot } from './lingot-qr-code.js';

describe('genererCodeQrLingot', () => {
  it('compose le QR à partir des données du lingot', () => {
    expect(
      genererCodeQrLingot({
        fournisseur: { nom: 'Boliden', code: 'AC123456' },
        numeroCoulee: '873033',
        numeroLingot: 2,
        poids: 1744,
        tauxAluminium: { nom: 'AL049', couleur: '#000000' },
        dateReception: new Date('2021-05-27T00:00:00.000Z'),
      }),
    ).toBe('ZN-AC123456-873033-002-1744-AL049-MG300-27052021');
  });
});
