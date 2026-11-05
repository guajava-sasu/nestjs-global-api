import { Types, type AnyBulkWriteOperation, type Model } from 'mongoose';
import type {
  Fournisseur,
  Lingot,
  LingotRecord,
  TauxAluminium,
  Zone,
} from './entities/lingot.entity.js';

export interface LegacyLingotStockReel {
  I_LGT_FOU_DATE: string;
  I_LGT_STK_COUL: number;
  I_LGT_STK_NUM: number;
  D_LGT_STK_PDS: number;
  D_LGT_STK_DAT_BAIN?: string;
  D_LGT_STK_POT?: number;
  D_LGT_STK_PREPA?: string;
  D_LGT_STK_DAT_MAJ: string;
  D_LGT_STK_TYP_APA: string;
  D_LGT_STK_DAT_MK?: string;
}

export type LingotStockImporte = Lingot & {
  createdAt: Date;
  updatedAt: Date;
};

export interface RapportImportLingotStock {
  lus: number;
  importes: number;
  ignores: number;
  erreurs: string[];
}

export interface OptionsConversionLingotStock {
  fournisseurs?: readonly Fournisseur[];
  tauxAluminium?: readonly TauxAluminium[];
  zones?: readonly Zone[];
  choisir?: <T>(valeurs: readonly T[]) => T;
}

const fuseauSource = 'Europe/Paris';
const tailleLotDefaut = 1000;

const choisirAleatoirement = <T>(valeurs: readonly T[]): T =>
  valeurs[Math.floor(Math.random() * valeurs.length)] as T;

// Décalage (ms) de Europe/Paris par rapport à UTC à un instant donné (heure d'été incluse)
function decalageParisMs(instantMs: number): number {
  const parties = new Intl.DateTimeFormat('en-US', {
    timeZone: fuseauSource,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(instantMs));
  const v = Object.fromEntries(parties.map((p) => [p.type, Number(p.value)]));
  return (
    Date.UTC(v.year, v.month - 1, v.day, v.hour, v.minute, v.second) - instantMs
  );
}

// "JJ/MM/AAAA HH:mm[:ss]" interprété en heure de Paris → Date
export function parserDateParis(valeur: string): Date {
  const m = valeur
    .trim()
    .match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) throw new Error(`Date invalide : "${valeur}"`);
  const [, jour, mois, annee, heure, minute, seconde] = m;
  const approximation = Date.UTC(
    Number(annee),
    Number(mois) - 1,
    Number(jour),
    Number(heure),
    Number(minute),
    Number(seconde ?? 0),
  );
  return new Date(approximation - decalageParisMs(approximation));
}

// La date source se termine par une fraction de seconde ("…:51:01", "…:37:546", "…:29:5") non gérée
export function retirerCentiemes(valeur: string): string {
  return valeur.trim().replace(/^(.*:\d{2}):\d{1,3}$/, '$1');
}

export function convertirLingotStock(
  source: LegacyLingotStockReel,
  options: OptionsConversionLingotStock = {},
  dateImport: Date = new Date(),
): LingotStockImporte {
  const choisir = options.choisir ?? choisirAleatoirement;
  const fournisseurs = options.fournisseurs ?? [];
  const tauxAluminium = options.tauxAluminium ?? [];
  const zones = options.zones ?? [];

  if (!fournisseurs?.length) {
    throw new Error('Aucun fournisseur disponible dans la base de données.');
  }
  if (!tauxAluminium.length) {
    throw new Error(
      "Aucun taux d'aluminium disponible dans la base de données.",
    );
  }
  if (!zones.length) {
    throw new Error('Aucune zone disponible dans la base de données.');
  }

  const numeroCoulee = String(source.I_LGT_STK_COUL);
  const numeroLingot = source.I_LGT_STK_NUM;
  const codeQR = `3031-${numeroCoulee}-${String(numeroLingot).padStart(3, '0')}`;

  return {
    _id: new Types.ObjectId(),
    codeQR,
    fournisseur: choisir(fournisseurs),
    numeroCoulee,
    numeroLingot,
    poids: source.D_LGT_STK_PDS,
    tauxAluminium: choisir(tauxAluminium),
    dateReception: parserDateParis(retirerCentiemes(source.I_LGT_FOU_DATE)),
    zone: choisir(zones),
    ...(source.D_LGT_STK_DAT_MK?.trim()
      ? {
          dateFusion: parserDateParis(
            retirerCentiemes(source.D_LGT_STK_DAT_MK),
          ),
        }
      : {}),
    createdAt: dateImport,
    updatedAt: parserDateParis(retirerCentiemes(source.D_LGT_STK_DAT_MAJ)),
  };
}

// Lit les sources par curseur, convertit et upsert par lots sur `id` (idempotent)
export async function importerLingotsStock(
  sources: AsyncIterable<LegacyLingotStockReel>,
  modele: Model<LingotRecord>,
  options: OptionsConversionLingotStock & {
    taille?: number;
    dateImport?: Date;
  } = {},
): Promise<RapportImportLingotStock> {
  const taille = options.taille ?? tailleLotDefaut;
  const dateImport = options.dateImport ?? new Date();
  const rapport: RapportImportLingotStock = {
    lus: 0,
    importes: 0,
    ignores: 0,
    erreurs: [],
  };

  let lot: AnyBulkWriteOperation<LingotRecord>[] = [];

  const envoyerLot = async () => {
    if (lot.length === 0) return;
    const res = await modele.bulkWrite(lot, {
      ordered: false,
      timestamps: false,
    });
    rapport.importes += res.upsertedCount + res.modifiedCount;
    lot = [];
  };

  for await (const source of sources) {
    rapport.lus++;
    try {
      const lingot = convertirLingotStock(source, options, dateImport);
      lot.push({
        replaceOne: {
          filter: { codeQR: lingot.codeQR },
          replacement: lingot as LingotRecord,
          upsert: true,
        },
      });
    } catch (erreur) {
      rapport.ignores++;
      const message = erreur instanceof Error ? erreur.message : String(erreur);
      rapport.erreurs.push(
        `coulée ${source.I_LGT_STK_COUL} / lingot ${source.I_LGT_STK_NUM} : ${message}`,
      );
    }

    if (lot.length >= taille) await envoyerLot();
  }

  await envoyerLot();
  return rapport;
}
