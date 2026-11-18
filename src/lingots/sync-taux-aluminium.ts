import mongoose, { Types } from 'mongoose';
import { LINGOTS_DATABASE_NAME } from './lingots.constants.js';

interface TauxCopie {
  _id: Types.ObjectId;
  nom?: string;
  couleur?: string;
}

interface TauxReference {
  _id: Types.ObjectId;
  nom: string;
  couleur: string;
}

const uri =
  process.env.MONGODB_GESTION_LINGOTS_URI ??
  process.env.MONGODB_URI ??
  'mongodb://localhost:27017/nestjs-global-api';

// Chemin du taux dans chaque collection ; `tableau` = champ tableau à dérouler.
const emplacements = [
  { collection: 'lingots', chemin: 'tauxAluminium' },
  { collection: 'mouvements-lingots', chemin: 'lingot.tauxAluminium' },
  {
    collection: 'inventaires-lingots',
    tableau: 'lingots',
    chemin: 'tauxAluminium',
  },
  {
    collection: 'historique-stock-lingots',
    tableau: 'quantiteParTaux',
    chemin: 'taux',
  },
] as const;

const normaliser = (valeur?: string) => (valeur ?? '').trim().toLowerCase();
const chiffres = (valeur?: string) => Number((valeur ?? '').replace(/\D/g, ''));

function trouverCorrespondant(
  copie: TauxCopie,
  references: TauxReference[],
): TauxReference | undefined {
  return (
    references.find((ref) => ref._id.equals(copie._id)) ??
    references.find((ref) => normaliser(ref.nom) === normaliser(copie.nom)) ??
    references.find(
      (ref) => normaliser(ref.couleur) === normaliser(copie.couleur),
    ) ??
    // Dernier recours : nombre le plus proche dans le nom (ex. AL040 → AL039).
    [...references].sort(
      (a, b) =>
        Math.abs(chiffres(a.nom) - chiffres(copie.nom)) -
        Math.abs(chiffres(b.nom) - chiffres(copie.nom)),
    )[0]
  );
}

async function synchroniserTaux(): Promise<void> {
  await mongoose.connect(uri, { dbName: LINGOTS_DATABASE_NAME });
  const db = mongoose.connection.db!;
  const references = await db
    .collection<TauxReference>('taux-aluminium-lingots')
    .find({}, { projection: { _id: 1, nom: 1, couleur: 1 } })
    .toArray();
  if (references.length === 0) {
    throw new Error('Le référentiel taux-aluminium-lingots est vide.');
  }

  for (const emplacement of emplacements) {
    const collection = db.collection(emplacement.collection);
    const tableau = 'tableau' in emplacement ? emplacement.tableau : undefined;
    const cheminComplet = tableau
      ? `${tableau}.${emplacement.chemin}`
      : emplacement.chemin;

    const copies = await collection
      .aggregate<{ _id: TauxCopie }>([
        ...(tableau ? [{ $unwind: `$${tableau}` }] : []),
        { $group: { _id: `$${cheminComplet}` } },
      ])
      .toArray();

    let modifies = 0;
    for (const { _id: copie } of copies) {
      if (!copie?._id) continue;
      const reference = trouverCorrespondant(copie, references);
      if (!reference) continue;
      const remplacement = {
        _id: reference._id,
        nom: reference.nom,
        couleur: reference.couleur,
      };

      const resultat = tableau
        ? await collection.updateMany(
            { [`${cheminComplet}._id`]: copie._id },
            {
              $set: {
                [`${tableau}.$[element].${emplacement.chemin}`]: remplacement,
              },
            },
            {
              arrayFilters: [
                { [`element.${emplacement.chemin}._id`]: copie._id },
              ],
            },
          )
        : await collection.updateMany(
            { [`${cheminComplet}._id`]: copie._id },
            { $set: { [cheminComplet]: remplacement } },
          );
      modifies += resultat.modifiedCount;

      if (!reference._id.equals(copie._id)) {
        console.info(
          `${emplacement.collection} : ${copie.nom ?? copie._id.toString()} remplacé par ${reference.nom}.`,
        );
      }
    }
    console.info(
      `${emplacement.collection} : ${modifies} document(s) mis à jour.`,
    );
  }

  // Deux anciens taux remplacés par le même : on additionne leurs poids.
  const historiques = db.collection('historique-stock-lingots');
  const aFusionner = await historiques
    .find({
      $expr: {
        $ne: [
          { $size: { $setUnion: '$quantiteParTaux.taux._id' } },
          { $size: '$quantiteParTaux' },
        ],
      },
    })
    .toArray();
  for (const historique of aFusionner) {
    const fusion = new Map<string, { taux: TauxReference; poids: number }>();
    for (const ligne of historique.quantiteParTaux as {
      taux: TauxReference;
      poids: number;
    }[]) {
      const cle = ligne.taux._id.toString();
      const existante = fusion.get(cle);
      if (existante) existante.poids += ligne.poids;
      else fusion.set(cle, { ...ligne });
    }
    await historiques.updateOne(
      { _id: historique._id },
      { $set: { quantiteParTaux: [...fusion.values()] } },
    );
  }
  if (aFusionner.length > 0) {
    console.info(
      `historique-stock-lingots : ${aFusionner.length} historique(s) fusionné(s).`,
    );
  }
}

try {
  await synchroniserTaux();
} catch (error) {
  console.error('Échec de la synchronisation des taux :', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
