import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  FournisseurRecord,
  HistoriqueStockRecord,
  InventaireRecord,
  LingotRecord,
  MatteRecord,
  MouvementRecord,
  OperateurRecord,
  TauxAluminiumRecord,
  TypeZoneRecord,
  ZoneRecord,
  ConfigurationRecord,
} from './entities/lingot.entity.js';
import { LINGOTS_CONNECTION_NAME } from './lingots.constants.js';
import { LingotsService } from './lingots.service.js';

function requete<T>(valeur: T) {
  const query = {
    session: vi.fn().mockReturnThis(),
    lean: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(valeur),
  };
  return query;
}

describe('POST /lingots/dechiffrer', () => {
  it('retourne seulement les champs connus et ne crée rien si le QR est incomplet', async () => {
    const models = {
      lingots: {
        db: { startSession: vi.fn() },
        create: vi.fn(),
      },
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        LingotsService,
        {
          provide: getModelToken(LingotRecord.name, LINGOTS_CONNECTION_NAME),
          useValue: models.lingots,
        },
        {
          provide: getModelToken('Orphelingot', LINGOTS_CONNECTION_NAME),
          useValue: {},
        },
        ...[
          OperateurRecord,
          FournisseurRecord,
          TauxAluminiumRecord,
          ZoneRecord,
          InventaireRecord,
          MatteRecord,
          MouvementRecord,
          HistoriqueStockRecord,
          ConfigurationRecord,
          TypeZoneRecord,
        ].map((record) => ({
          provide: getModelToken(record.name, LINGOTS_CONNECTION_NAME),
          useValue: {},
        })),
      ],
    }).compile();

    try {
      const service = moduleRef.get(LingotsService);
      await expect(
        service.dechiffrerLingot({
          codeQR: 'ZN-AC359079-178425',
          zone: 'S',
          operateur: 'OP1',
        }),
      ).resolves.toEqual({
        statut: 'incomplet',
        lingot: {
          fournisseur: 'AC359079',
          numeroCoulee: '178425',
        },
      });
      expect(models.lingots.db.startSession).not.toHaveBeenCalled();
      expect(models.lingots.create).not.toHaveBeenCalled();
    } finally {
      await moduleRef.close();
    }
  });

  it('crée atomiquement la fiche et le mouvement à partir des informations complétées', async () => {
    const id = new Types.ObjectId();
    const fournisseur = {
      _id: new Types.ObjectId(),
      code: 'AC359079',
      nom: 'Fournisseur',
    };
    const tauxAluminium = {
      _id: new Types.ObjectId(),
      nom: 'AL069',
      couleur: '#000000',
    };
    const zone = {
      _id: new Types.ObjectId(),
      code: 'S',
      nom: 'Stock',
      typeOperation: { _id: new Types.ObjectId(), code: 'ST', nom: 'Stockage' },
    };
    const operateur = {
      _id: new Types.ObjectId(),
      username: 'test',
      entreprise: 'test',
      nom: 'Test',
      prenom: 'Opérateur',
      codeQR: 'OP1',
    };
    const document = {
      _id: id,
      codeQR: 'ZN-AC359079-178425-019-1919-AL069-MG300-15102026',
      fournisseur,
      numeroCoulee: '178425',
      numeroLingot: 19,
      poids: 1919,
      tauxAluminium,
      dateReception: new Date(),
      zone,
      toObject: vi.fn().mockReturnValue({ _id: id }),
    };
    const session = {
      withTransaction: vi.fn(async (operation: () => Promise<void>) =>
        operation(),
      ),
      endSession: vi.fn(),
    };
    const models = {
      lingots: {
        db: { startSession: vi.fn().mockResolvedValue(session) },
        findOne: vi.fn().mockReturnValue(requete(null)),
        create: vi.fn().mockResolvedValue([document]),
      },
      fournisseurs: { findOne: vi.fn().mockReturnValue(requete(fournisseur)) },
      tauxAluminium: {
        findOne: vi.fn().mockReturnValue(requete(tauxAluminium)),
      },
      zones: { findOne: vi.fn().mockReturnValue(requete(zone)) },
      operateurs: { findOne: vi.fn().mockReturnValue(requete(operateur)) },
      mouvements: { create: vi.fn().mockResolvedValue([{}]) },
    };
    const modelValues = new Map<string, object>([
      [LingotRecord.name, models.lingots],
      ['Orphelingot', {}],
      [OperateurRecord.name, models.operateurs],
      [FournisseurRecord.name, models.fournisseurs],
      [TauxAluminiumRecord.name, models.tauxAluminium],
      [ZoneRecord.name, models.zones],
      [InventaireRecord.name, {}],
      [MatteRecord.name, {}],
      [MouvementRecord.name, models.mouvements],
      [HistoriqueStockRecord.name, {}],
      [ConfigurationRecord.name, {}],
      [TypeZoneRecord.name, {}],
    ]);
    const moduleRef = await Test.createTestingModule({
      providers: [
        LingotsService,
        ...Array.from(modelValues, ([name, useValue]) => ({
          provide: getModelToken(name, LINGOTS_CONNECTION_NAME),
          useValue,
        })),
      ],
    }).compile();

    try {
      const service = moduleRef.get(LingotsService);
      const debut = Date.now();
      await expect(
        service.dechiffrerLingot({
          codeQR: 'ZN-AC359079-178425-019-1919-AL069-MG300-15102026',
          zone: 'S',
          operateur: 'OP1',
          informations: {
            fournisseur: 'AC359079',
            numeroCoulee: '178425',
            numeroLingot: 19,
            poids: 1919,
            tauxAluminium: 'AL069',
          },
        }),
      ).resolves.toEqual({
        statut: 'cree',
        lingot: {
          _id: id.toString(),
          codeQR: 'ZN-AC359079-178425-019-1919-AL069-MG300-15102026',
          fournisseur: 'AC359079',
          numeroCoulee: '178425',
          numeroLingot: 19,
          poids: 1919,
          tauxAluminium: 'AL069',
        },
      });

      expect(session.withTransaction).toHaveBeenCalledOnce();
      expect(models.lingots.create).toHaveBeenCalledOnce();
      expect(models.mouvements.create).toHaveBeenCalledOnce();
      const [mouvement] = models.mouvements.create.mock.calls[0]?.[0] ?? [];
      expect(mouvement).toMatchObject({
        depart: null,
        arrivee: zone,
        operateur,
        lingot: { _id: id },
      });
      const [fiche] = models.lingots.create.mock.calls[0]?.[0] ?? [];
      expect(mouvement.date).toEqual(fiche.dateReception);
      expect(fiche.dateFusion).toEqual(new Date('2026-10-15T00:00:00.000Z'));
      expect(mouvement.date.getTime()).toBeGreaterThanOrEqual(debut);
      expect(mouvement.date.getTime()).toBeLessThanOrEqual(Date.now());
      expect(session.endSession).toHaveBeenCalledOnce();

      models.lingots.findOne.mockReturnValueOnce(requete(document));
      await expect(
        service.dechiffrerLingot({
          codeQR: 'ZN-AC359079-178425-019-1919-AL069-MG300-15102026',
          zone: 'S',
          operateur: 'OP1',
          informations: {
            fournisseur: 'AC359079',
            numeroCoulee: '178425',
            numeroLingot: 19,
            poids: 1919,
            tauxAluminium: 'AL069',
          },
        }),
      ).rejects.toMatchObject({ status: 409 });
      expect(models.lingots.create).toHaveBeenCalledOnce();
      expect(models.mouvements.create).toHaveBeenCalledOnce();
    } finally {
      await moduleRef.close();
    }
  });
});
