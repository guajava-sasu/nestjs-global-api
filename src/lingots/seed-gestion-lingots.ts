import mongoose, { Types } from 'mongoose';
import { readFile } from 'node:fs/promises';
import {
  Fournisseur,
  FournisseurRecord,
  FournisseurSchema,
  HistoriqueStockRecord,
  HistoriqueStockSchema,
  Lingot,
  LingotRecord,
  LingotSchema,
  MouvementRecord,
  MouvementSchema,
  Operateur,
  OperateurRecord,
  OperateurSchema,
  TauxAluminium,
  TauxAluminiumRecord,
  TauxAluminiumSchema,
  Zone,
  ZoneRecord,
  ZoneSchema,
} from './entities/lingot.entity.js';
import { LINGOTS_DATABASE_NAME } from './lingots.constants.js';
import {
  convertirLingotStock,
  type LegacyLingotStockReel,
} from './lingot-stock-conversion.js';

const uri =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nestjs-global-api';
const codesZonesUniques = ['PO1', 'PO2', 'PM1', 'PM2', 'CO', 'CM'];

const zonesDefinies: Omit<Zone, '_id'>[] = [
  { nom: 'Four', code: 'F' },
  { nom: 'Stock', code: 'S' },
  { nom: 'Bureau', code: 'B' },
  { nom: 'Coulée opérateur', code: 'CO' },
  { nom: 'Coulée moteur', code: 'CM' },
  { nom: 'Quarantaine', code: 'Q' },
  { nom: 'Préparation moteur 1', code: 'PM1' },
  { nom: 'Préparation moteur 2', code: 'PM2' },
  { nom: 'Préparation opérateur 1', code: 'PO1' },
  { nom: 'Préparation opérateur 2', code: 'PO2' },
];

const operateursNoms = [
  ['Alice', 'Mercier'],
  ['Karim', 'Lefebvre'],
  ['Nora', 'Petit'],
  ['Hugo', 'Carpentier'],
  ['Mina', 'Rousseau'],
  ['Elias', 'Garnier'],
  ['Jade', 'Morel'],
  ['Yanis', 'Faure'],
];

function verifierAutorisationReset(): void {
  const hostname = new URL(uri).hostname;
  const hotesLocaux = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
  if (!hotesLocaux.has(hostname) && process.env.CONFIRM_DB_RESET !== 'true') {
    throw new Error(
      'Le seed remplace toute la base gestion_lingots. Pour une base distante, définissez CONFIRM_DB_RESET=true.',
    );
  }
}

function choisirAleatoirement<T>(valeurs: readonly T[]): T {
  if (valeurs.length === 0) throw new Error('Impossible de choisir une liste vide.');
  return valeurs[Math.floor(Math.random() * valeurs.length)] as T;
}

async function lireJson<T>(nomFichier: string): Promise<T[]> {
  const contenu = await readFile(
    new URL(`../../docs/api-examples/lingots/${nomFichier}`, import.meta.url),
    'utf8',
  );
  const valeur: unknown = JSON.parse(contenu, (_cle, element: unknown) => {
    if (element && typeof element === 'object') {
      const extended = element as Record<string, unknown>;
      if (typeof extended.$oid === 'string') {
        return new Types.ObjectId(extended.$oid);
      }
      if (typeof extended.$date === 'string') {
        return new Date(extended.$date);
      }
    }
    return element;
  });
  if (!Array.isArray(valeur)) {
    throw new Error(`${nomFichier} doit contenir un tableau JSON.`);
  }
  return valeur as T[];
}

function valeurColonne(
  cellules: string[],
  indexParColonne: Map<string, number>,
  colonne: string,
  ligne: number,
): string {
  const index = indexParColonne.get(colonne);
  if (index === undefined || cellules[index] === undefined) {
    throw new Error(`Colonne ${colonne} absente à la ligne ${ligne}.`);
  }
  return cellules[index]!.trim();
}

function nombreCsv(valeur: string, colonne: string, ligne: number): number {
  const nombre = Number(valeur);
  if (!Number.isFinite(nombre)) {
    throw new Error(`Valeur invalide pour ${colonne}, ligne ${ligne}.`);
  }
  return nombre;
}

async function lireCsv(): Promise<LegacyLingotStockReel[]> {
  const contenu = await readFile(
    new URL('../../docs/api-examples/lingots/T_LGT_STK.csv', import.meta.url),
    'utf8',
  );
  const lignes = contenu.replace(/^\uFEFF/, '').split(/\r?\n/);
  const entetes = lignes.shift()?.split(';').map((entete) => entete.trim());
  if (!entetes) throw new Error('Le fichier T_LGT_STK.csv est vide.');
  const indexParColonne = new Map(
    entetes.map((entete, index) => [entete, index]),
  );
  const sources: LegacyLingotStockReel[] = [];

  for (const [index, contenuLigne] of lignes.entries()) {
    if (!contenuLigne.trim()) continue;
    const numeroLigne = index + 2;
    const cellules = contenuLigne.split(';');
    const dateFusion = valeurColonne(
      cellules,
      indexParColonne,
      'D_LGT_STK_DAT_MK',
      numeroLigne,
    );
    sources.push({
      I_LGT_FOU_DATE: valeurColonne(
        cellules,
        indexParColonne,
        'I_LGT_FOU_DATE',
        numeroLigne,
      ),
      I_LGT_STK_COUL: nombreCsv(
        valeurColonne(cellules, indexParColonne, 'I_LGT_STK_COUL', numeroLigne),
        'I_LGT_STK_COUL',
        numeroLigne,
      ),
      I_LGT_STK_NUM: nombreCsv(
        valeurColonne(cellules, indexParColonne, 'I_LGT_STK_NUM', numeroLigne),
        'I_LGT_STK_NUM',
        numeroLigne,
      ),
      D_LGT_STK_PDS: nombreCsv(
        valeurColonne(cellules, indexParColonne, 'D_LGT_STK_PDS', numeroLigne),
        'D_LGT_STK_PDS',
        numeroLigne,
      ),
      D_LGT_STK_DAT_MAJ: valeurColonne(
        cellules,
        indexParColonne,
        'D_LGT_STK_DAT_MAJ',
        numeroLigne,
      ),
      D_LGT_STK_TYP_APA: valeurColonne(
        cellules,
        indexParColonne,
        'D_LGT_STK_TYP_APA',
        numeroLigne,
      ),
      ...(dateFusion ? { D_LGT_STK_DAT_MK: dateFusion } : {}),
    });
  }

  return sources;
}

function creerOperateurs(): Operateur[] {
  return operateursNoms.map(([prenom, nom], index) => ({
    _id: new Types.ObjectId(),
    username: `${prenom}.${nom}`.toLowerCase(),
    entreprise: 'ArcelorMittal',
    nom,
    prenom,
    codeQR: `OPERATEUR-${String(index + 1).padStart(3, '0')}`,
  }));
}

function creerTauxAluminium(
  exemples: Array<Record<string, unknown>>,
  types: string[],
): TauxAluminium[] {
  return exemples.flatMap((exemple) =>
    types.map((type) => ({
      _id: new Types.ObjectId(),
      nom: String(exemple.nom),
      couleur: String(exemple.couleur),
      type,
    })),
  );
}

async function seedGestionLingots(): Promise<void> {
  verifierAutorisationReset();
  const [fournisseursExemples, tauxExemples, sources] = await Promise.all([
    lireJson<Record<string, unknown>>('gestion-lingots.fournisseurs-lingots.json'),
    lireJson<Record<string, unknown>>('gestion-lingots.taux-aluminium-lingots.json'),
    lireCsv(),
  ]);

  const fournisseurs: Fournisseur[] = fournisseursExemples.map((exemple) => ({
    _id:
      exemple._id instanceof Types.ObjectId
        ? exemple._id
        : new Types.ObjectId(),
    nom: String(exemple.nom),
    code: String(exemple.code),
  }));
  const types = [...new Set(sources.map((source) => source.D_LGT_STK_TYP_APA.trim()))]
    .filter(Boolean);
  if (types.length === 0) {
    throw new Error('Aucun type de taux présent dans le CSV.');
  }
  const tauxAluminium = creerTauxAluminium(tauxExemples, types);
  const zones: Zone[] = zonesDefinies.map((zone) => ({
    ...zone,
    _id: new Types.ObjectId(),
  }));
  const operateurs = creerOperateurs();
  const zonesInitiales = zones.filter((zone) => ['F', 'S', 'B'].includes(zone.code));
  const zonesNonReservees = zones.filter(
    (zone) => !codesZonesUniques.includes(zone.code),
  );
  const tauxParType = new Map(
    types.map((type) => [
      type,
      tauxAluminium.filter((taux) => taux.type === type),
    ]),
  );

  if (sources.length < codesZonesUniques.length) {
    throw new Error('Le CSV doit contenir au moins six lingots.');
  }
  if (fournisseurs.length === 0 || tauxAluminium.length === 0) {
    throw new Error('Les fichiers JSON de référentiels sont vides.');
  }

  const codesQR = new Set<string>();
  const lingots: Lingot[] = sources.map((source, index) => {
    const type = source.D_LGT_STK_TYP_APA.trim();
    const zone = index < codesZonesUniques.length
      ? zones.find((candidate) => candidate.code === codesZonesUniques[index])
      : choisirAleatoirement(zonesNonReservees);
    if (!zone) throw new Error('Zone requise introuvable.');

    const lingot = convertirLingotStock(
      source,
      {
        fournisseurs,
        tauxAluminium: tauxParType.get(type),
        zones: [zone],
        choisir: choisirAleatoirement,
      },
    );
    if (codesQR.has(lingot.codeQR)) {
      throw new Error(`Code QR dupliqué dans le CSV : ${lingot.codeQR}.`);
    }
    codesQR.add(lingot.codeQR);
    return lingot;
  });

  const mouvements: MouvementRecord[] = [];
  for (const lingot of lingots) {
    const arriveeInitiale = choisirAleatoirement(zonesInitiales);
    mouvements.push({
      _id: new Types.ObjectId(),
      depart: null,
      arrivee: arriveeInitiale,
      date: lingot.dateReception,
      operateur: choisirAleatoirement(operateurs),
      lingot,
    } as MouvementRecord);
    if (lingot.zone.code !== arriveeInitiale.code) {
      mouvements.push({
        _id: new Types.ObjectId(),
        depart: arriveeInitiale,
        arrivee: lingot.zone,
        date: new Date(lingot.dateReception.getTime() + 60 * 60 * 1000),
        operateur: choisirAleatoirement(operateurs),
        lingot,
      } as MouvementRecord);
    }
  }

  const minDate = Math.min(...lingots.map((lingot) => lingot.dateReception.getTime()));
  const maxDate = Date.now();
  const historiques = Array.from({ length: 100 }, (_, index) => {
    const date = new Date(minDate + ((maxDate - minDate) * index) / 99);
    const fournisseur = choisirAleatoirement(fournisseurs);
    const lingotsDuFournisseur = lingots.filter(
      (lingot) =>
        lingot.dateReception <= date &&
        lingot.fournisseur._id.equals(fournisseur._id),
    );
    const poidsParTaux = new Map<string, { taux: TauxAluminium; poids: number }>();

    for (const lingot of lingotsDuFournisseur) {
      const cle = `${lingot.tauxAluminium.nom}-${lingot.tauxAluminium.type}`;
      const ligne = poidsParTaux.get(cle) ?? {
        taux: lingot.tauxAluminium,
        poids: 0,
      };
      ligne.poids += lingot.poids;
      poidsParTaux.set(cle, ligne);
    }

    return {
      _id: new Types.ObjectId(),
      date,
      quantiteMatte: Math.floor(Math.random() * 1000),
      fournisseur,
      quantiteParTaux: [...poidsParTaux.values()],
    };
  });

  await mongoose.connect(uri, { dbName: LINGOTS_DATABASE_NAME });
  try {
    await mongoose.connection.dropDatabase();

    const FournisseurModel = mongoose.model(
      FournisseurRecord.name,
      FournisseurSchema,
    );
    const TauxModel = mongoose.model(TauxAluminiumRecord.name, TauxAluminiumSchema);
    const ZoneModel = mongoose.model(ZoneRecord.name, ZoneSchema);
    const OperateurModel = mongoose.model(OperateurRecord.name, OperateurSchema);
    const LingotModel = mongoose.model(LingotRecord.name, LingotSchema);
    const MouvementModel = mongoose.model(MouvementRecord.name, MouvementSchema);
    const HistoriqueModel = mongoose.model(
      HistoriqueStockRecord.name,
      HistoriqueStockSchema,
    );

    await Promise.all([
      FournisseurModel.insertMany(fournisseurs),
      TauxModel.insertMany(tauxAluminium),
      ZoneModel.insertMany(zones),
      OperateurModel.insertMany(operateurs),
      LingotModel.insertMany(lingots),
      MouvementModel.insertMany(mouvements),
      HistoriqueModel.insertMany(historiques),
    ]);

    console.info(
      `Base ${LINGOTS_DATABASE_NAME} recréée : ${fournisseurs.length} fournisseurs, ${tauxAluminium.length} taux, ${zones.length} zones, ${operateurs.length} opérateurs, ${lingots.length} lingots, ${mouvements.length} mouvements et ${historiques.length} historiques.`,
    );
  } finally {
    await mongoose.disconnect();
  }
}

try {
  await seedGestionLingots();
} catch (error) {
  console.error('Échec du seed gestion_lingots :', error);
  process.exitCode = 1;
  await mongoose.disconnect();
}