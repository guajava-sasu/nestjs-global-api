import { BadRequestException } from '@nestjs/common';
import { dechiffrerCodeQrLingot } from './lingot-qr-dechiffrage.js';

describe('dechiffrerCodeQrLingot', () => {
  it('extrait les champs connus et la date de création du format ZN', () => {
    expect(
      dechiffrerCodeQrLingot(
        'ZN-AC359079-178425-019-1919-AL069-MG300-15102026',
      ),
    ).toEqual({
      informations: {
        fournisseur: 'AC359079',
        numeroCoulee: '178425',
        numeroLingot: 19,
        poids: 1919,
        tauxAluminium: 'AL069',
      },
      dateCreation: new Date('2026-10-15T00:00:00.000Z'),
    });
  });

  it('conserve les champs déjà lus lorsque le QR reconnu est tronqué', () => {
    expect(dechiffrerCodeQrLingot('ZN-AC359079-178425')).toEqual({
      informations: {
        fournisseur: 'AC359079',
        numeroCoulee: '178425',
      },
    });
  });

  it('signale un format inconnu ou un segment invalide', () => {
    expect(() => dechiffrerCodeQrLingot('XX-AC359079-178425')).toThrow(
      BadRequestException,
    );
    expect(() => dechiffrerCodeQrLingot('ZN-AC359079-ABCDEF')).toThrow(
      BadRequestException,
    );
    expect(() =>
      dechiffrerCodeQrLingot(
        'ZN-AC359079-178425-019-1919-AL069-MG300-32132026',
      ),
    ).toThrow(BadRequestException);
  });
});
