import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CreateConfigurationDto,
  DechiffrerLingotDto,
  CreateFournisseurDto,
  CreateHistoriqueStockDto,
  CreateInventaireDto,
  CreateLingotDto,
  CreateMatteDto,
  CreateMouvementCollectionDto,
  CreateMouvementDto,
  CreateOperateurDto,
  CreateTauxAluminiumDto,
  UpdateConfigurationDto,
  UpdateFournisseurDto,
  UpdateHistoriqueStockDto,
  UpdateInventaireDto,
  UpdateLingotDto,
  UpdateMatteDto,
  UpdateMouvementDto,
  UpdateOperateurDto,
  UpdateTauxAluminiumDto,
  UpdateZoneDto,
  ZoneDto,
} from './dto/lingot.dto.js';
import {
  ConfigurationRecord,
  FournisseurRecord,
  HistoriqueStockRecord,
  InventaireRecord,
  LingotRecord,
  MatteRecord,
  Mouvement,
  MouvementRecord,
  OperateurRecord,
  TauxAluminiumRecord,
  TypeZoneRecord,
  ZoneRecord,
} from './entities/lingot.entity.js';
import { genererCodeQrLingot } from './lingot-qr-code.js';
import {
  dechiffrerCodeQrLingot,
  type InformationsLingotDechiffrees,
} from './lingot-qr-dechiffrage.js';
import { LINGOTS_CONNECTION_NAME } from './lingots.constants.js';

function idFilter(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new NotFoundException(`Identifiant MongoDB invalide: ${id}`);
  }
  return { _id: new Types.ObjectId(id) };
}

function fusionnerValeurDechiffree<T>(
  champ: keyof InformationsLingotDechiffrees,
  dechiffree: T | undefined,
  fournie: T | undefined,
): T | undefined {
  if (
    dechiffree !== undefined &&
    fournie !== undefined &&
    dechiffree !== fournie
  ) {
    throw new BadRequestException(
      `La valeur fournie pour "${champ}" ne correspond pas au code QR.`,
    );
  }
  return fournie ?? dechiffree;
}

@Injectable()
export class LingotsService {
  constructor(
    @InjectModel(LingotRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly lingots: Model<LingotRecord>,
    @InjectModel('Orphelingot', LINGOTS_CONNECTION_NAME)
    private readonly orphelingots: Model<LingotRecord>,
    @InjectModel(OperateurRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly operateurs: Model<OperateurRecord>,
    @InjectModel(FournisseurRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly fournisseurs: Model<FournisseurRecord>,
    @InjectModel(TauxAluminiumRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly tauxAluminium: Model<TauxAluminiumRecord>,
    @InjectModel(ZoneRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly zones: Model<ZoneRecord>,
    @InjectModel(InventaireRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly inventaires: Model<InventaireRecord>,
    @InjectModel(MatteRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly mattes: Model<MatteRecord>,
    @InjectModel(MouvementRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly mouvements: Model<MouvementRecord>,
    @InjectModel(HistoriqueStockRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly historiques: Model<HistoriqueStockRecord>,
    @InjectModel(ConfigurationRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly configuration: Model<ConfigurationRecord>,
    @InjectModel(TypeZoneRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly typesZone: Model<TypeZoneRecord>,
  ) {}

  createConfiguration(data: CreateConfigurationDto) {
    return this.configuration.create(data);
  }
  findConfigurations() {
    return this.configuration.find().sort({ cle: 1 }).exec();
  }
  findConfiguration(id: string) {
    return this.findRecord(this.configuration, id, 'Configuration introuvable');
  }
  updateConfiguration(id: string, data: UpdateConfigurationDto) {
    return this.updateRecord(
      this.configuration,
      id,
      data,
      'Configuration introuvable',
    );
  }
  removeConfiguration(id: string) {
    return this.removeRecord(
      this.configuration,
      id,
      'Configuration introuvable',
    );
  }

  createOperateur(data: CreateOperateurDto) {
    return this.operateurs.create(data);
  }
  findOperateurs() {
    return this.operateurs.find().sort({ id: 1 }).exec();
  }
  async findOperateur(id: string) {
    return this.findRecord(this.operateurs, id, 'Opérateur introuvable');
  }
  async updateOperateur(id: string, data: UpdateOperateurDto) {
    return this.updateRecord(
      this.operateurs,
      id,
      data,
      'Opérateur introuvable',
    );
  }
  async removeOperateur(id: string) {
    return this.removeRecord(this.operateurs, id, 'Opérateur introuvable');
  }

  createFournisseur(data: CreateFournisseurDto) {
    return this.fournisseurs.create(data);
  }
  findFournisseurs() {
    return this.fournisseurs.find().sort({ nom: 1 }).exec();
  }
  async findFournisseur(id: string) {
    return this.findRecord(this.fournisseurs, id, 'Fournisseur introuvable');
  }
  async updateFournisseur(id: string, data: UpdateFournisseurDto) {
    return this.updateRecord(
      this.fournisseurs,
      id,
      data,
      'Fournisseur introuvable',
    );
  }
  async removeFournisseur(id: string) {
    return this.removeRecord(this.fournisseurs, id, 'Fournisseur introuvable');
  }

  createTauxAluminium(data: CreateTauxAluminiumDto) {
    return this.tauxAluminium.create(data);
  }
  findTauxAluminium() {
    return this.tauxAluminium.find().sort({ nom: 1 }).exec();
  }
  async findTauxAluminiumById(id: string) {
    return this.findRecord(
      this.tauxAluminium,
      id,
      'Taux d’aluminium introuvable',
    );
  }
  async updateTauxAluminium(id: string, data: UpdateTauxAluminiumDto) {
    return this.updateRecord(
      this.tauxAluminium,
      id,
      data,
      'Taux d’aluminium introuvable',
    );
  }
  async removeTauxAluminium(id: string) {
    return this.removeRecord(
      this.tauxAluminium,
      id,
      'Taux d’aluminium introuvable',
    );
  }

  findTypesZone() {
    return this.typesZone.find().sort({ code: 1 }).exec();
  }
  async createZone(data: ZoneDto) {
    return this.zones.create(await this.resoudreTypeZone(data));
  }
  findZones() {
    return this.zones.find().sort({ nom: 1 }).exec();
  }
  async findZonesByOperationType(operation: string) {
    return this.findRecord(
      this.zones,
      operation,
      'Zone introuvable pour cette opération',
    );
  }
  async findZone(id: string) {
    return this.findRecord(this.zones, id, 'Zone introuvable');
  }
  async updateZone(id: string, data: UpdateZoneDto) {
    const zone = data.typeOperation
      ? await this.resoudreTypeZone({ typeOperation: data.typeOperation })
      : {};
    return this.updateRecord(
      this.zones,
      id,
      { ...data, ...zone },
      'Zone introuvable',
    );
  }
  async removeZone(id: string) {
    return this.removeRecord(this.zones, id, 'Zone introuvable');
  }

  async createLingot(data: CreateLingotDto) {
    return this.lingots.create(await this.preparerLingot(data));
  }
  async dechiffrerLingot(data: DechiffrerLingotDto) {
    const { informations: dechiffrees, dateCreation } = dechiffrerCodeQrLingot(
      data.codeQR,
    );
    const informations: InformationsLingotDechiffrees = {
      fournisseur: fusionnerValeurDechiffree(
        'fournisseur',
        dechiffrees.fournisseur,
        data.informations?.fournisseur,
      ),
      numeroCoulee: fusionnerValeurDechiffree(
        'numeroCoulee',
        dechiffrees.numeroCoulee,
        data.informations?.numeroCoulee,
      ),
      numeroLingot: fusionnerValeurDechiffree(
        'numeroLingot',
        dechiffrees.numeroLingot,
        data.informations?.numeroLingot,
      ),
      poids: fusionnerValeurDechiffree(
        'poids',
        dechiffrees.poids,
        data.informations?.poids,
      ),
      tauxAluminium: fusionnerValeurDechiffree(
        'tauxAluminium',
        dechiffrees.tauxAluminium,
        data.informations?.tauxAluminium,
      ),
    };
    const champsObligatoires: (keyof InformationsLingotDechiffrees)[] = [
      'fournisseur',
      'numeroCoulee',
      'numeroLingot',
      'poids',
      'tauxAluminium',
    ];
    if (champsObligatoires.some((champ) => informations[champ] === undefined)) {
      return { statut: 'incomplet' as const, lingot: informations };
    }

    const fournisseurCode = informations.fournisseur;
    const numeroCoulee = informations.numeroCoulee;
    const numeroLingot = informations.numeroLingot;
    const poids = informations.poids;
    const tauxAluminiumNom = informations.tauxAluminium;
    if (
      fournisseurCode === undefined ||
      numeroCoulee === undefined ||
      numeroLingot === undefined ||
      poids === undefined ||
      tauxAluminiumNom === undefined
    ) {
      throw new InternalServerErrorException(
        'Les informations complètes du lingot sont indisponibles.',
      );
    }

    const session = await this.lingots.db.startSession();
    try {
      let documentCree: LingotRecord | undefined;
      await session.withTransaction(async () => {
        const lingotExistant = await this.lingots
          .findOne({ codeQR: data.codeQR })
          .session(session)
          .exec();
        if (lingotExistant) {
          throw new ConflictException('Un lingot avec ce code QR existe déjà.');
        }

        const fournisseur = await this.fournisseurs
          .findOne({ code: fournisseurCode })
          .session(session)
          .lean()
          .exec();
        if (!fournisseur) {
          throw new BadRequestException(
            `Le fournisseur "${fournisseurCode}" est introuvable.`,
          );
        }

        const tauxAluminium = await this.tauxAluminium
          .findOne({ nom: tauxAluminiumNom })
          .session(session)
          .lean()
          .exec();
        if (!tauxAluminium) {
          throw new BadRequestException(
            `Le taux d'aluminium "${tauxAluminiumNom}" est introuvable.`,
          );
        }

        const zone = await this.zones
          .findOne({ code: data.zone })
          .session(session)
          .lean()
          .exec();
        if (!zone) {
          throw new BadRequestException(
            `La zone "${data.zone}" est introuvable.`,
          );
        }

        const operateur = await this.operateurs
          .findOne({ codeQR: data.operateur })
          .session(session)
          .lean()
          .exec();
        if (!operateur) {
          throw new BadRequestException(
            `L'opérateur "${data.operateur}" est introuvable.`,
          );
        }

        const dateReception = new Date();
        const [lingot] = await this.lingots.create(
          [
            {
              codeQR: data.codeQR,
              fournisseur,
              numeroCoulee,
              numeroLingot,
              poids,
              tauxAluminium,
              dateReception,
              zone,
              ...(dateCreation && { dateFusion: dateCreation }),
            },
          ],
          { session },
        );
        if (!lingot) {
          throw new InternalServerErrorException(
            'La fiche du lingot n’a pas été créée.',
          );
        }
        await this.mouvements.create(
          [
            {
              depart: null,
              arrivee: zone,
              date: dateReception,
              operateur,
              lingot: lingot.toObject() as unknown as Mouvement['lingot'],
            },
          ],
          { session },
        );
        documentCree = lingot;
      });

      if (!documentCree) {
        throw new InternalServerErrorException(
          'La transaction n’a pas créé la fiche du lingot.',
        );
      }
      return {
        statut: 'cree' as const,
        lingot: {
          _id: documentCree._id.toString(),
          codeQR: documentCree.codeQR,
          fournisseur: documentCree.fournisseur.code,
          numeroCoulee: documentCree.numeroCoulee,
          numeroLingot: documentCree.numeroLingot,
          poids: documentCree.poids,
          tauxAluminium: documentCree.tauxAluminium.nom,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new ConflictException('Un lingot avec ce code QR existe déjà.', {
          cause: error,
        });
      }
      throw new InternalServerErrorException(
        'Impossible de créer atomiquement le lingot et son mouvement initial.',
        { cause: error },
      );
    } finally {
      await session.endSession();
    }
  }
  findLingots() {
    return this.lingots.find().sort({ id: 1 }).exec();
  }
  findOrphelingots() {
    return this.orphelingots
      .find({ 'tauxAluminium.nom': 'AL00' })
      .sort({ numeroCoulee: 1, numeroLingot: 1 })
      .exec();
  }
  async findLingot(id: string) {
    return this.findRecord(this.lingots, id, `Lingot "${id}" introuvable`);
  }
  async updateLingot(id: string, data: UpdateLingotDto) {
    return this.updateRecord(
      this.lingots,
      id,
      await this.preparerZonesLingot(data),
      `Lingot "${id}" introuvable`,
    );
  }
  async removeLingot(id: string) {
    return this.removeRecord(this.lingots, id, `Lingot "${id}" introuvable`);
  }

  async createInventaire(data: CreateInventaireDto) {
    return this.inventaires.create({
      ...data,
      lingots: await Promise.all(
        data.lingots.map((lingot) => this.preparerLingot(lingot)),
      ),
    });
  }
  findInventaires() {
    return this.inventaires.find().sort({ date: -1 }).exec();
  }
  async findInventaire(id: string) {
    return this.findRecord(this.inventaires, id, 'Inventaire introuvable');
  }
  async updateInventaire(id: string, data: UpdateInventaireDto) {
    return this.updateRecord(
      this.inventaires,
      id,
      {
        ...data,
        ...(data.lingots && {
          lingots: await Promise.all(
            data.lingots.map((lingot) => this.preparerLingot(lingot)),
          ),
        }),
      },
      'Inventaire introuvable',
    );
  }
  async removeInventaire(id: string) {
    return this.removeRecord(this.inventaires, id, 'Inventaire introuvable');
  }

  createMatte(data: CreateMatteDto) {
    return this.mattes.create(data);
  }
  findMattes() {
    return this.mattes.find().sort({ date: -1 }).exec();
  }
  async findMatte(id: string) {
    return this.findRecord(this.mattes, id, 'Mouvement de matte introuvable');
  }
  async updateMatte(id: string, data: UpdateMatteDto) {
    return this.updateRecord(
      this.mattes,
      id,
      data,
      'Mouvement de matte introuvable',
    );
  }
  async removeMatte(id: string) {
    return this.removeRecord(this.mattes, id, 'Mouvement de matte introuvable');
  }

  async createMouvement(lingotId: string, data: CreateMouvementDto) {
    const lingot = await this.findLingot(lingotId);
    const mouvement = await this.preparerZonesMouvement(data);
    return this.mouvements.create({
      ...mouvement,
      depart: mouvement.depart ?? null,
      lingot: lingot.toObject() as unknown as Mouvement['lingot'],
    });
  }
  createMouvementCollection(data: CreateMouvementCollectionDto) {
    const { lingotId, ...mouvement } = data;
    return this.createMouvement(lingotId, mouvement);
  }
  findAllMouvements() {
    return this.mouvements.find().sort({ date: -1 }).exec();
  }
  findMouvementById(id: string) {
    return this.findRecord(this.mouvements, id, 'Mouvement introuvable');
  }
  async updateMouvementById(id: string, data: UpdateMouvementDto) {
    return this.updateRecord(
      this.mouvements,
      id,
      await this.preparerZonesMouvement(data),
      'Mouvement introuvable',
    );
  }
  removeMouvementById(id: string) {
    return this.removeRecord(this.mouvements, id, 'Mouvement introuvable');
  }
  async findMouvements(lingotId: string) {
    await this.findLingot(lingotId);
    return this.mouvements
      .find({ 'lingot._id': new Types.ObjectId(lingotId) })
      .sort({ date: 1 })
      .exec();
  }
  async findMouvement(lingotId: string, mouvementId: string) {
    await this.findLingot(lingotId);
    const mouvement = await this.mouvements
      .findOne({
        ...idFilter(mouvementId),
        'lingot._id': new Types.ObjectId(lingotId),
      })
      .exec();
    if (!mouvement) throw new NotFoundException('Mouvement introuvable');
    return mouvement;
  }
  async updateMouvement(
    lingotId: string,
    mouvementId: string,
    data: UpdateMouvementDto,
  ) {
    await this.findLingot(lingotId);
    const mouvement = await this.mouvements
      .findOneAndUpdate(
        {
          ...idFilter(mouvementId),
          'lingot._id': new Types.ObjectId(lingotId),
        },
        { $set: await this.preparerZonesMouvement(data) },
        { new: true, runValidators: true },
      )
      .exec();
    if (!mouvement) throw new NotFoundException('Mouvement introuvable');
    return mouvement;
  }
  async removeMouvement(lingotId: string, mouvementId: string) {
    await this.findLingot(lingotId);
    const mouvement = await this.mouvements
      .findOneAndDelete({
        ...idFilter(mouvementId),
        'lingot._id': new Types.ObjectId(lingotId),
      })
      .exec();
    if (!mouvement) throw new NotFoundException('Mouvement introuvable');
    return mouvement;
  }

  createHistoriqueStock(data: CreateHistoriqueStockDto) {
    return this.historiques.create(data);
  }
  findHistoriquesStock() {
    return this.historiques.find().sort({ date: -1 }).exec();
  }
  async findHistoriqueStock(id: string) {
    return this.findRecord(
      this.historiques,
      id,
      'Historique de stock introuvable',
    );
  }
  async updateHistoriqueStock(id: string, data: UpdateHistoriqueStockDto) {
    return this.updateRecord(
      this.historiques,
      id,
      data,
      'Historique de stock introuvable',
    );
  }
  async removeHistoriqueStock(id: string) {
    return this.removeRecord(
      this.historiques,
      id,
      'Historique de stock introuvable',
    );
  }

  private async resoudreTypeZone<T extends Pick<ZoneDto, 'typeOperation'>>(
    zone: T,
  ) {
    const { _id, code } = zone.typeOperation;
    const typeOperation = await this.typesZone
      .findOne({ _id, code })
      .lean()
      .exec();
    if (!typeOperation) {
      throw new BadRequestException(
        'Le type de zone doit correspondre au référentiel TypeZone.',
      );
    }
    return {
      ...zone,
      typeOperation: {
        _id: typeOperation._id,
        code: typeOperation.code,
        nom: typeOperation.nom,
      },
    };
  }

  private async preparerZonesLingot<T extends UpdateLingotDto>(data: T) {
    return data.zone
      ? { ...data, zone: await this.resoudreTypeZone(data.zone) }
      : data;
  }

  private async preparerLingot(data: CreateLingotDto) {
    return {
      ...data,
      zone: await this.resoudreTypeZone(data.zone),
      codeQR: genererCodeQrLingot(data),
    };
  }

  private async preparerZonesMouvement(data: UpdateMouvementDto) {
    const [depart, arrivee] = await Promise.all([
      data.depart ? this.resoudreTypeZone(data.depart) : data.depart,
      data.arrivee ? this.resoudreTypeZone(data.arrivee) : data.arrivee,
    ]);
    return {
      ...data,
      ...(depart !== undefined && { depart }),
      ...(arrivee !== undefined && { arrivee }),
    };
  }

  private async findRecord<T>(model: Model<T>, id: string, message: string) {
    const record = await model.findOne(idFilter(id)).exec();
    if (!record) throw new NotFoundException(message);
    return record;
  }

  private async updateRecord<T>(
    model: Model<T>,
    id: string,
    data: object,
    message: string,
  ) {
    const record = await model
      .findOneAndUpdate(
        idFilter(id),
        { $set: data },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();
    if (!record) throw new NotFoundException(message);
    return record;
  }

  private async removeRecord<T>(model: Model<T>, id: string, message: string) {
    const record = await model.findOneAndDelete(idFilter(id)).exec();
    if (!record) throw new NotFoundException(message);
    return record;
  }
}
