import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CreateConfigurationDto,
  CreateFournisseurDto,
  CreateHistoriqueStockDto,
  CreateInventaireDto,
  CreateLingotDto,
  CreateMatteDto,
  CreateMouvementCollectionDto,
  CreateMouvementDto,
  CreateOperateurDto,
  CreateTauxAluminiumDto,
  CreateZoneDto,
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
  ZoneRecord,
} from './entities/lingot.entity.js';
import { LINGOTS_CONNECTION_NAME } from './lingots.constants.js';
import { genererCodeQrLingot } from './lingot-qr-code.js';

function idFilter(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new NotFoundException(`Identifiant MongoDB invalide: ${id}`);
  }
  return { _id: new Types.ObjectId(id) };
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
    return this.removeRecord(this.configuration, id, 'Configuration introuvable');
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

  createZone(data: CreateZoneDto) {
    return this.zones.create(data);
  }
  findZones() {
    return this.zones.find().sort({ nom: 1 }).exec();
  }
  async findZone(id: string) {
    return this.findRecord(this.zones, id, 'Zone introuvable');
  }
  async updateZone(id: string, data: UpdateZoneDto) {
    return this.updateRecord(this.zones, id, data, 'Zone introuvable');
  }
  async removeZone(id: string) {
    return this.removeRecord(this.zones, id, 'Zone introuvable');
  }

  createLingot(data: CreateLingotDto) {
    return this.lingots.create({
      ...data,
      codeQR: genererCodeQrLingot(data),
    });
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
      data,
      `Lingot "${id}" introuvable`,
    );
  }
  async removeLingot(id: string) {
    return this.removeRecord(this.lingots, id, `Lingot "${id}" introuvable`);
  }

  createInventaire(data: CreateInventaireDto) {
    return this.inventaires.create({
      ...data,
      lingots: data.lingots.map((lingot) => ({
        ...lingot,
        codeQR: genererCodeQrLingot(lingot),
      })),
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
      data,
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
    return this.mouvements.create({
      ...data,
      depart: data.depart ?? null,
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
  updateMouvementById(id: string, data: UpdateMouvementDto) {
    return this.updateRecord(
      this.mouvements,
      id,
      data,
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
        { $set: data },
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
