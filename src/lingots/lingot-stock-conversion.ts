import type { AnyBulkWriteOperation, Model } from 'mongoose';
import type {
  LingotStock,
  LingotStockRecord,
  TypeLingot,
} from './entities/lingot.entity.old.js';

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
}

export type LingotStockImporte = LingotStock & {
  createdAt: Date;
  updatedAt: Date;
};

export interface ValeursParDefautLingotStock {
  fournisseur: string;
  alFournisseur: number;
  alArcelor: number;
  valide: boolean;
}

export interface RapportImportLingotStock {
  lus: number;
  importes: number;
  ignores: number;
  erreurs: string[];
}

export const valeursParDefautLingotStock: ValeursParDefautLingotStock = {
  fournisseur: 'NON RENSEIGNE',
  alFournisseur: 0,
  alArcelor: 0,
  valide: false,
};

export const fournisseursConnus: readonly string[] = [
  'BOLESLAW',
  'BOLIDEN',
  'GLENCORE',
  'NEXA',
  'TRAFIGUR',
];

const typesLingot: readonly TypeLingot[] = ['B', 'OB', 'VB', 'BB', 'N'];
const fuseauSource = 'Europe/Paris';
const tailleLotDefaut = 1000;

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

// La date de mise à jour source se termine par une fraction de seconde ("…:51:01", "…:37:546", "…:29:5") non gérée
export function retirerCentiemes(valeur: string): string {
  return valeur.trim().replace(/^(.*:\d{2}):\d{1,3}$/, '$1');
}

export function convertirLingotStock(
  source: LegacyLingotStockReel,
  valeurs: ValeursParDefautLingotStock = valeursParDefautLingotStock,
  dateImport: Date = new Date(),
): LingotStockImporte {
  const type = source.D_LGT_STK_TYP_APA.trim() as TypeLingot;
  if (!typesLingot.includes(type)) {
    throw new Error(`Type de lingot inconnu : "${source.D_LGT_STK_TYP_APA}"`);
  }

  const numeroCoulee = String(source.I_LGT_STK_COUL);
  const numeroLingot = source.I_LGT_STK_NUM;

  return {
    id: `NYRSTAR-3031-${numeroCoulee}-${String(numeroLingot).padStart(3, '0')}`,
    poids: source.D_LGT_STK_PDS,
    fournisseur: valeurs.fournisseur,
    numeroCoulee,
    valide: valeurs.valide,
    numeroLingot,
    alFournisseur: valeurs.alFournisseur,
    alArcelor: valeurs.alArcelor,
    dateReception: parserDateParis(retirerCentiemes(source.I_LGT_FOU_DATE)),
    type,
    createdAt: dateImport,
    updatedAt: parserDateParis(retirerCentiemes(source.D_LGT_STK_DAT_MAJ)),
  };
}

// Lit les sources par curseur, convertit et upsert par lots sur `id` (idempotent)
export async function importerLingotsStock(
  sources: AsyncIterable<LegacyLingotStockReel>,
  modele: Model<LingotStockRecord>,
  options: {
    taille?: number;
    valeurs?: ValeursParDefautLingotStock;
    fournisseurs?: readonly string[];
    dateImport?: Date;
  } = {},
): Promise<RapportImportLingotStock> {
  const taille = options.taille ?? tailleLotDefaut;
  const dateImport = options.dateImport ?? new Date();
  const fournisseurs = options.fournisseurs ?? fournisseursConnus;
  const valeursBase = options.valeurs ?? valeursParDefautLingotStock;
  const rapport: RapportImportLingotStock = {
    lus: 0,
    importes: 0,
    ignores: 0,
    erreurs: [],
  };

  let lot: AnyBulkWriteOperation<LingotStockRecord>[] = [];

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
      const fournisseur =
        fournisseurs[Math.floor(Math.random() * fournisseurs.length)] ??
        valeursBase.fournisseur;
      const lingot = convertirLingotStock(
        source,
        { ...valeursBase, fournisseur },
        dateImport,
      );
      lot.push({
        replaceOne: {
          filter: { id: lingot.id },
          replacement: lingot,
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
