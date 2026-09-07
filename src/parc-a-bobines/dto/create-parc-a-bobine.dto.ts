export class AlerteTransitionDto {
  BackgroundColor: string;
  ForegroundColor: string;
  Message: string;
}

export class CreateParcABobineDto {
  bobine: string;
  identite: string;
  lot: number;
  montage: number;
  largeur: string;
  diametre: number;
  epaisseur: number;
  poids: number;
  cycle: string;
  prod: string;
  zav: number;
  zar: number;
  def: string;
  client: string;
  texteLibre: string;
  commandes: string;
  type: string;
  Transition?: boolean;
  AlerteTransition?: AlerteTransitionDto;
}
