import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomUUID } from 'node:crypto';
import {
  CreateFournisseurDto,
  CreateInventaireDto,
  CreateLingotDto,
  CreateMatteDto,
  CreateMouvementDto,
  CreateOperateurDto,
  CreatePositionDto,
  CreateTauxAluminiumDto,
  UpdateFournisseurDto,
  UpdateInventaireDto,
  UpdateLingotDto,
  UpdateMatteDto,
  UpdateMouvementDto,
  UpdateOperateurDto,
  UpdatePositionDto,
  UpdateTauxAluminiumDto,
} from './dto/lingot.dto.js';
import {
  FournisseurRecord,
  InventaireRecord,
  LingotRecord,
  MatteRecord,
  Mouvement,
  OperateurRecord,
  PositionRecord,
  TauxAluminiumRecord,
} from './entities/lingot.entity.js';
import { LINGOTS_CONNECTION_NAME } from './lingots.constants.js';

function idFilter(id: string) {
  return Types.ObjectId.isValid(id)
    ? { $or: [{ id }, { _id: new Types.ObjectId(id) }] }
    : { id };
}

@Injectable()
export class LingotsService {
  constructor(
    @InjectModel(LingotRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly lingots: Model<LingotRecord>,
    @InjectModel(OperateurRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly operateurs: Model<OperateurRecord>,
    @InjectModel(FournisseurRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly fournisseurs: Model<FournisseurRecord>,
    @InjectModel(TauxAluminiumRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly tauxAluminium: Model<TauxAluminiumRecord>,
    @InjectModel(PositionRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly positions: Model<PositionRecord>,
    @InjectModel(InventaireRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly inventaires: Model<InventaireRecord>,
    @InjectModel(MatteRecord.name, LINGOTS_CONNECTION_NAME)
    private readonly mattes: Model<MatteRecord>,
  ) {}

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
    return this.fournisseurs.create({ ...data, id: data.id ?? randomUUID() });
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
    return this.tauxAluminium.create({ ...data, id: data.id ?? randomUUID() });
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

  createPosition(data: CreatePositionDto) {
    return this.positions.create({ ...data, id: data.id ?? randomUUID() });
  }
  findPositions() {
    return this.positions.find().sort({ nom: 1 }).exec();
  }
  async findPosition(id: string) {
    return this.findRecord(this.positions, id, 'Position introuvable');
  }
  async updatePosition(id: string, data: UpdatePositionDto) {
    return this.updateRecord(this.positions, id, data, 'Position introuvable');
  }
  async removePosition(id: string) {
    return this.removeRecord(this.positions, id, 'Position introuvable');
  }

  createLingot(data: CreateLingotDto) {
    return this.lingots.create(data);
  }
  findLingots() {
    return this.lingots.find().sort({ id: 1 }).exec();
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
    return this.inventaires.create({ ...data, id: data.id ?? randomUUID() });
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
    return this.mattes.create({ ...data, id: data.id ?? randomUUID() });
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
    const mouvement: Mouvement = { ...data, id: data.id ?? randomUUID() };
    const lingot = await this.lingots
      .findOneAndUpdate(
        idFilter(lingotId),
        { $push: { mouvements: mouvement } },
        { new: true, runValidators: true },
      )
      .exec();
    if (!lingot)
      throw new NotFoundException(`Lingot "${lingotId}" introuvable`);
    return lingot.mouvements.find((item) => item.id === mouvement.id);
  }
  async findMouvements(lingotId: string) {
    return (await this.findLingot(lingotId)).mouvements;
  }
  async findMouvement(lingotId: string, mouvementId: string) {
    const lingot = await this.findLingot(lingotId);
    const mouvement = lingot.mouvements.find((item) => item.id === mouvementId);
    if (!mouvement) throw new NotFoundException('Mouvement introuvable');
    return mouvement;
  }
  async updateMouvement(
    lingotId: string,
    mouvementId: string,
    data: UpdateMouvementDto,
  ) {
    const fields = Object.fromEntries(
      Object.entries(data)
        .filter(([key]) => key !== 'id')
        .map(([key, value]) => [`mouvements.$.${key}`, value]),
    );
    if (Object.keys(fields).length === 0) {
      return this.findMouvement(lingotId, mouvementId);
    }

    const lingot = await this.lingots
      .findOneAndUpdate(
        { ...idFilter(lingotId), 'mouvements.id': mouvementId },
        { $set: fields },
        { new: true, runValidators: true },
      )
      .exec();
    if (!lingot) throw new NotFoundException('Mouvement introuvable');
    return lingot.mouvements.find((item) => item.id === mouvementId);
  }
  async removeMouvement(lingotId: string, mouvementId: string) {
    const mouvement = await this.findMouvement(lingotId, mouvementId);
    const lingot = await this.lingots
      .findOneAndUpdate(
        { ...idFilter(lingotId), 'mouvements.id': mouvementId },
        { $pull: { mouvements: { id: mouvementId } } },
        { new: true },
      )
      .exec();
    if (!lingot) throw new NotFoundException('Mouvement introuvable');
    return mouvement;
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
