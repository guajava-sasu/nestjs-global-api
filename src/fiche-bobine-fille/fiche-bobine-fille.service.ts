import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFicheBobineFilleDto } from './dto/create-fiche-bobine-fille.dto.js';
import { UpdateFicheBobineFilleDto } from './dto/update-fiche-bobine-fille.dto.js';
import {
  FicheBobineFille,
  FicheBobineFilleDocument,
} from './entities/fiche-bobine-fille.entity.js';
import {
  FicheBobineMere,
  FicheBobineMereDocument,
} from '../fiche-bobine-mere/entities/fiche-bobine-mere.entity.js';

const CODES_DECISION = ['ACCEPTE', 'REFUSE', 'ACCEPTE SOUS RESERVE'];
const INSPECTEURS = ['J. DUPONT', 'M. LEROY', 'S. BERNARD', 'A. PETIT', 'C. MARTIN'];
const TEXTES_LIBRES = [
  'RAS',
  'Conforme au cahier des charges',
  'Contrôle renforcé demandé',
  'A surveiller sur prochaine production',
  '',
];

@Injectable()
export class FicheBobineFilleService {
  constructor(
    @InjectModel(FicheBobineFille.name)
    private readonly ficheBobineFilleModel: Model<FicheBobineFilleDocument>,
    @InjectModel(FicheBobineMere.name)
    private readonly ficheBobineMereModel: Model<FicheBobineMereDocument>,
  ) {}

  create(createFicheBobineFilleDto: CreateFicheBobineFilleDto) {
    return this.ficheBobineFilleModel.create(createFicheBobineFilleDto);
  }

  findAll() {
    return this.ficheBobineFilleModel.find().exec();
  }

  findByBobineMere(identiteBobineMere: string) {
    return this.ficheBobineFilleModel.find({ identiteBobineMere }).exec();
  }

  async findOne(bobine: string) {
    const fiche = await this.ficheBobineFilleModel.findOne({ bobine }).exec();
    if (!fiche) {
      throw new NotFoundException(`Fiche bobine fille "${bobine}" introuvable`);
    }
    return fiche;
  }

  async update(bobine: string, updateFicheBobineFilleDto: UpdateFicheBobineFilleDto) {
    const fiche = await this.ficheBobineFilleModel
      .findOneAndUpdate({ bobine }, updateFicheBobineFilleDto, { new: true })
      .exec();
    if (!fiche) {
      throw new NotFoundException(`Fiche bobine fille "${bobine}" introuvable`);
    }
    return fiche;
  }

  async remove(bobine: string) {
    const fiche = await this.ficheBobineFilleModel.findOneAndDelete({ bobine }).exec();
    if (!fiche) {
      throw new NotFoundException(`Fiche bobine fille "${bobine}" introuvable`);
    }
    return fiche;
  }

  /**
   * Génère `count` fiches bobine fille aléatoires, chacune rattachée à une
   * bobine mère existante piochée au hasard dans la base.
   */
  async generateRandomFilles(count: number) {
    const meres = await this.ficheBobineMereModel.find().exec();
    if (meres.length === 0) {
      throw new NotFoundException('Aucune fiche bobine mère en base : impossible de générer des bobines filles');
    }

    const existingBobines = new Set((await this.ficheBobineFilleModel.distinct('bobine').exec()) as string[]);
    const dtos: CreateFicheBobineFilleDto[] = [];

    for (let i = 0; i < count; i++) {
      const mere = pickRandom(meres);
      const bobine = generateUniqueBobine(mere.bobine, existingBobines);
      existingBobines.add(bobine);
      dtos.push(buildFilleFromMere(mere, bobine));
    }

    return this.ficheBobineFilleModel.insertMany(dtos);
  }
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Ajoute une variation aléatoire de +/- percent % autour de la valeur, arrondie à 1 décimale. */
function jitter(value: number, percent = 2): number {
  const delta = value * (percent / 100) * (Math.random() * 2 - 1);
  return Math.round((value + delta) * 10) / 10;
}

function generateUniqueBobine(bobineMere: string, existing: Set<string>): string {
  let bobine: string;
  do {
    bobine = `${bobineMere.slice(0, 6)}${randomInt(10, 99)}`;
  } while (existing.has(bobine));
  return bobine;
}

function buildFilleFromMere(mereDocument: FicheBobineMereDocument, bobine: string): CreateFicheBobineFilleDto {
  const mere = mereDocument.toObject();
  const revetementsConsigne = {
    refAuto: mere.revetements.refAuto,
    avant: { ...mere.revetements.avant },
    arriere: { ...mere.revetements.arriere },
  };
  const formatSortieConsigne = {
    mini: { ...mere.formatSortie.mini },
    vise: { ...mere.formatSortie.vise },
    maxi: { ...mere.formatSortie.maxi },
  };

  const defauts = (mere.defauts ?? [])
    .filter(() => Math.random() < 0.4)
    .map((defaut) => ({
      bobine,
      numero: defaut.numero,
      type: defaut.type,
      debut: defaut.debut,
      fin: defaut.fin,
      long: defaut.long,
      face: defaut.face,
      imp: defaut.imp,
      renseignementComplementaires: defaut.renseignementComplementaires,
    }));

  return {
    bobine,
    identiteBobineMere: mere.bobine,
    generalites: {
      bobine,
      lot: mere.generalites.lot,
      montage: mere.generalites.montage,
      commande: mere.generalites.commande,
      client: mere.generalites.client,
      delai: mere.generalites.delai,
      aspect: mere.generalites.aspect,
      planeite: mere.generalites.planeite,
      type: mere.generalites.type,
    },
    dimensions: {
      longueur: jitter(mere.dimensions.longueur, 10),
      larg: mere.dimensions.larg,
      epais: mere.dimensions.epais,
      poids: jitter(mere.dimensions.poids, 10),
      diaExt: jitter(mere.dimensions.diaExt, 5),
      diaArr: mere.dimensions.diaArr,
      diaHte: mere.dimensions.diaHte,
      outilAmont: mere.dimensions.outilAmont,
    },
    revetements: {
      consigne: revetementsConsigne,
      reel: {
        refAuto: revetementsConsigne.refAuto,
        avant: { ...revetementsConsigne.avant, vise: jitter(revetementsConsigne.avant.vise, 3) },
        arriere: { ...revetementsConsigne.arriere, vise: jitter(revetementsConsigne.arriere.vise, 3) },
      },
    },
    formatSortie: {
      consigne: formatSortieConsigne,
      reel: {
        mini: formatSortieConsigne.mini,
        vise: {
          larg: jitter(formatSortieConsigne.vise.larg, 1),
          epai: jitter(formatSortieConsigne.vise.epai, 1),
        },
        maxi: formatSortieConsigne.maxi,
      },
    },
    vitesseCentre: {
      n2: mere.vitesseCentre.n2,
      rg: mere.vitesseCentre.rg,
      rgRef: mere.vitesseCentre.rgRef,
    },
    defauts,
    decision: {
      codeDecision: pickRandom(CODES_DECISION),
      signatureInspecteur: pickRandom(INSPECTEURS),
      defautImputation1: defauts[0]?.type ?? '',
      defautImputation2: defauts[1]?.type ?? '',
      defautImputation3: defauts[2]?.type ?? '',
      texteLibre: pickRandom(TEXTES_LIBRES),
    },
  };
}

