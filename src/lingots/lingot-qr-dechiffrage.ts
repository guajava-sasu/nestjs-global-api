import { BadRequestException } from '@nestjs/common';

export interface InformationsLingotDechiffrees {
  fournisseur?: string;
  numeroCoulee?: string;
  numeroLingot?: number;
  poids?: number;
  tauxAluminium?: string;
}

export interface CodeQrLingotDechiffre {
  informations: InformationsLingotDechiffrees;
  dateCreation?: Date;
}

type FormatQrLingot = (codeQR: string) => CodeQrLingotDechiffre | null;

const formatsQrLingot: FormatQrLingot[] = [
  (codeQR) => {
    const segments = codeQR.split('-');
    if (segments[0] !== 'ZN') return null;
    if (segments.length > 8) {
      throw new BadRequestException('Le code QR ZN contient trop de segments.');
    }

    const informations: InformationsLingotDechiffrees = {};
    const validations: Array<
      [number, RegExp, keyof InformationsLingotDechiffrees]
    > = [
      [1, /^AC\d{6}$/, 'fournisseur'],
      [2, /^\d{6}$/, 'numeroCoulee'],
      [3, /^\d{1,3}$/, 'numeroLingot'],
      [4, /^\d{4}$/, 'poids'],
      [5, /^AL\d{3}$/, 'tauxAluminium'],
    ];

    for (const [index, format, champ] of validations) {
      if (index >= segments.length) break;
      const segment = segments[index];
      if (!segment || !format.test(segment)) {
        throw new BadRequestException(
          `Le segment ${index + 1} du code QR ZN est invalide.`,
        );
      }
      switch (champ) {
        case 'fournisseur':
          informations.fournisseur = segment;
          break;
        case 'numeroCoulee':
          informations.numeroCoulee = segment;
          break;
        case 'numeroLingot':
          informations.numeroLingot = Number(segment);
          break;
        case 'poids':
          informations.poids = Number(segment);
          break;
        case 'tauxAluminium':
          informations.tauxAluminium = segment;
          break;
      }
    }

    if (segments.length >= 7 && !/^MG\d{3}$/.test(segments[6] ?? '')) {
      throw new BadRequestException(
        'Le segment magnésium du code QR ZN est invalide.',
      );
    }
    let dateCreation: Date | undefined;
    if (segments.length >= 8) {
      const dateCode = segments[7] ?? '';
      const dateParts = /^(\d{2})(\d{2})(\d{4})$/.exec(dateCode);
      if (!dateParts) {
        throw new BadRequestException(
          'La date de création du lingot dans le code QR ZN est invalide.',
        );
      }
      const [, jour, mois, annee] = dateParts;
      dateCreation = new Date(
        Date.UTC(Number(annee), Number(mois) - 1, Number(jour)),
      );
      if (
        dateCreation.getUTCFullYear() !== Number(annee) ||
        dateCreation.getUTCMonth() !== Number(mois) - 1 ||
        dateCreation.getUTCDate() !== Number(jour)
      ) {
        throw new BadRequestException(
          'La date de création du lingot dans le code QR ZN est invalide.',
        );
      }
    }

    return {
      informations,
      ...(dateCreation && { dateCreation }),
    };
  },
];

export function dechiffrerCodeQrLingot(codeQR: string): CodeQrLingotDechiffre {
  for (const format of formatsQrLingot) {
    const resultat = format(codeQR);
    if (resultat) return resultat;
  }
  throw new BadRequestException('Le format du code QR est inconnu.');
}
