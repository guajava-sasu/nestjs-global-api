import type { CreateLingotDto } from './dto/lingot.dto.js';

export function genererCodeQrLingot(
  lingot: Pick<
    CreateLingotDto,
    | 'fournisseur'
    | 'numeroCoulee'
    | 'numeroLingot'
    | 'poids'
    | 'tauxAluminium'
    | 'dateReception'
  >,
): string {
  const date = lingot.dateReception;
  const dateCode = [
    String(date.getUTCDate()).padStart(2, '0'),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCFullYear()).padStart(4, '0'),
  ].join('');

  return [
    'ZN',
    lingot.fournisseur.code,
    lingot.numeroCoulee.padStart(6, '0'),
    String(lingot.numeroLingot).padStart(3, '0'),
    String(lingot.poids).padStart(4, '0'),
    lingot.tauxAluminium.nom,
    'MG300',
    dateCode,
  ].join('-');
}
