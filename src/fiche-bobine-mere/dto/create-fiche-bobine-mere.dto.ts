export class GeneralitesDto {
  bobine: string;
  lot: number;
  montage: number;
  commande: string;
  client: string;
  delai: number;
  halle: string;
  emplacement: string;
  aspect: number;
  planeite: number;
  outilAmont: string;
  codeRecuit: string;
  type: string;
}

export class DimensionsDto {
  longueur: number;
  larg: number;
  epais: number;
  poids: number;
  diaExt: number;
  diaArr: number;
  diaHte: number;
  outilAmont: string;
}

export class LimitesDto {
  mini: number;
  vise: number;
  maxi: number;
}

export class RevetementsDto {
  refAuto: boolean;
  avant: LimitesDto;
  arriere: LimitesDto;
}

export class VitesseCentreDto {
  n2: number;
  rg: number;
  rgRef: number;
}

export class ChutageDto {
  debut: number;
  fin: number;
  causeDebut: string;
  causeFin: string;
}

export class FormatSortieLimitesDto {
  larg: number;
  epai: number;
}

export class FormatSortieDto {
  mini: FormatSortieLimitesDto;
  vise: FormatSortieLimitesDto;
  maxi: FormatSortieLimitesDto;
}

export class SuggestionDto {
  ordre: number;
  libelle: string;
}

export class DefautDto {
  bobine: string;
  numero: number;
  type: string;
  debut: number;
  fin: number;
  long: string;
  face: string;
  imp: number;
  renseignementComplementaires: string;
}

export class CreateFicheBobineMereDto {
  bobine: string;
  generalites: GeneralitesDto;
  dimensions: DimensionsDto;
  revetements: RevetementsDto;
  vitesseCentre: VitesseCentreDto;
  chutage: ChutageDto;
  formatSortie: FormatSortieDto;
  suggestions: SuggestionDto[];
  defauts: DefautDto[];
}
