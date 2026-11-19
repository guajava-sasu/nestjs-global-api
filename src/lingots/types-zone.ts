export const TYPES_ZONE = [
  { code: 'ST', nom: 'Stockage' },
  { code: 'PR', nom: 'Preparation' },
  { code: 'BA', nom: 'Bain' },
];

export const CODE_TYPE_PAR_ZONE: Readonly<Partial<Record<string, string>>> = {
  S: 'ST',
  B: 'ST',
  Q: 'ST',
  PM1: 'PR',
  PM2: 'PR',
  PO1: 'PR',
  PO2: 'PR',
  F: 'BA',
  CO: 'BA',
  CM: 'BA',
};
