import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CreateBilanLingotsJourDto,
  CreateEtatStockJournalierDto,
  CreateLigneReceptionLingotDto,
  CreateLingotStockDto,
  CreateLivraisonFournisseurDto,
  CreateMouvementLingotDto,
  CreateOperateurTrackerDto,
  CreateReceptionLingotDto,
  CreateZoneDto,
  UpdateBilanLingotsJourDto,
  UpdateEtatStockJournalierDto,
  UpdateLigneReceptionLingotDto,
  UpdateLingotStockDto,
  UpdateLivraisonFournisseurDto,
  UpdateMouvementLingotDto,
  UpdateOperateurTrackerDto,
  UpdateReceptionLingotDto,
  UpdateZoneDto,
} from './dto/lingots.dto.js';
import {
  BilanLingotsJourDocument,
  BilanLingotsJourRecord,
  EtatStockJournalierDocument,
  EtatStockJournalierRecord,
  LigneReceptionLingotDocument,
  LigneReceptionLingotRecord,
  LingotStockDocument,
  LingotStockRecord,
  LivraisonFournisseurDocument,
  LivraisonFournisseurRecord,
  MouvementLingotDocument,
  MouvementLingotRecord,
  OperateurTrackerDocument,
  OperateurTrackerRecord,
  ReceptionLingotDocument,
  ReceptionLingotRecord,
  ZoneDocument,
  ZoneRecord,
} from './entities/lingot.entity.js';

function idFilter(id: string) {
  return Types.ObjectId.isValid(id)
    ? { $or: [{ id }, { _id: new Types.ObjectId(id) }] }
    : { id };
}

@Injectable()
export class LingotsService {
  constructor(
    @InjectModel(LingotStockRecord.name)
    private readonly lingots: Model<LingotStockDocument>,
    @InjectModel(LivraisonFournisseurRecord.name)
    private readonly livraisons: Model<LivraisonFournisseurDocument>,
    @InjectModel(LigneReceptionLingotRecord.name)
    private readonly lignesReception: Model<LigneReceptionLingotDocument>,
    @InjectModel(ReceptionLingotRecord.name)
    private readonly receptions: Model<ReceptionLingotDocument>,
    @InjectModel(EtatStockJournalierRecord.name)
    private readonly etatsStock: Model<EtatStockJournalierDocument>,
    @InjectModel(MouvementLingotRecord.name)
    private readonly mouvements: Model<MouvementLingotDocument>,
    @InjectModel(BilanLingotsJourRecord.name)
    private readonly bilans: Model<BilanLingotsJourDocument>,
    @InjectModel(OperateurTrackerRecord.name)
    private readonly operateursTracker: Model<OperateurTrackerDocument>,
    @InjectModel(ZoneRecord.name)
    private readonly zones: Model<ZoneDocument>,
  ) {}

  createOperateurTracker(data: CreateOperateurTrackerDto) {
    return this.operateursTracker.create(data);
  }
  findOperateursTracker() {
    return this.operateursTracker.find().exec();
  }
  async findOperateurTracker(id: string) {
    const record = await this.operateursTracker.findOne({ id }).exec();
    if (!record) throw new NotFoundException('Opérateur Tracker introuvable');
    return record;
  }
  async updateOperateurTracker(id: string, data: UpdateOperateurTrackerDto) {
    const record = await this.operateursTracker
      .findOneAndUpdate({ id }, data, { new: true, runValidators: true })
      .exec();
    if (!record) throw new NotFoundException('Opérateur Tracker introuvable');
    return record;
  }
  async removeOperateurTracker(id: string) {
    const record = await this.operateursTracker.findOneAndDelete({ id }).exec();
    if (!record) throw new NotFoundException('Opérateur Tracker introuvable');
    return record;
  }

  createZone(data: CreateZoneDto) {
    return this.zones.create(data);
  }
  findZones() {
    return this.zones.find().sort({ id: 1 }).exec();
  }
  async findZone(id: number) {
    const record = await this.zones.findOne({ id }).exec();
    if (!record) throw new NotFoundException('Zone introuvable');
    return record;
  }
  async updateZone(id: number, data: UpdateZoneDto) {
    const record = await this.zones
      .findOneAndUpdate({ id }, data, { new: true, runValidators: true })
      .exec();
    if (!record) throw new NotFoundException('Zone introuvable');
    return record;
  }
  async removeZone(id: number) {
    const record = await this.zones.findOneAndDelete({ id }).exec();
    if (!record) throw new NotFoundException('Zone introuvable');
    return record;
  }

  createLingot(data: CreateLingotStockDto) {
    return this.lingots.create(data);
  }
  findLingots() {
    return this.lingots.find().exec();
  }
  async findLingot(id: string) {
    const record = await this.lingots.findOne({ id }).exec();
    if (!record) throw new NotFoundException(`Lingot "${id}" introuvable`);
    return record;
  }
  async updateLingot(id: string, data: UpdateLingotStockDto) {
    const record = await this.lingots
      .findOneAndUpdate({ id }, data, { new: true, runValidators: true })
      .exec();
    if (!record) throw new NotFoundException(`Lingot "${id}" introuvable`);
    return record;
  }
  async removeLingot(id: string) {
    const record = await this.lingots.findOneAndDelete({ id }).exec();
    if (!record) throw new NotFoundException(`Lingot "${id}" introuvable`);
    return record;
  }

  createLivraison(data: CreateLivraisonFournisseurDto) {
    return this.livraisons.create(data);
  }
  findLivraisons() {
    return this.livraisons.find().exec();
  }
  async findLivraison(id: string) {
    const record = await this.livraisons.findOne(idFilter(id)).exec();
    if (!record) throw new NotFoundException('Livraison introuvable');
    return record;
  }
  async updateLivraison(id: string, data: UpdateLivraisonFournisseurDto) {
    const record = await this.livraisons
      .findOneAndUpdate(idFilter(id), data, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!record) throw new NotFoundException('Livraison introuvable');
    return record;
  }
  async removeLivraison(id: string) {
    const record = await this.livraisons.findOneAndDelete(idFilter(id)).exec();
    if (!record) throw new NotFoundException('Livraison introuvable');
    return record;
  }

  createLigneReception(data: CreateLigneReceptionLingotDto) {
    return this.lignesReception.create(data);
  }
  findLignesReception() {
    return this.lignesReception.find().exec();
  }
  async findLigneReception(id: string) {
    const record = await this.lignesReception.findOne(idFilter(id)).exec();
    if (!record) throw new NotFoundException('Ligne de réception introuvable');
    return record;
  }
  async updateLigneReception(id: string, data: UpdateLigneReceptionLingotDto) {
    const record = await this.lignesReception
      .findOneAndUpdate(idFilter(id), data, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!record) throw new NotFoundException('Ligne de réception introuvable');
    return record;
  }
  async removeLigneReception(id: string) {
    const record = await this.lignesReception
      .findOneAndDelete(idFilter(id))
      .exec();
    if (!record) throw new NotFoundException('Ligne de réception introuvable');
    return record;
  }

  createReception(data: CreateReceptionLingotDto) {
    return this.receptions.create(data);
  }
  findReceptions() {
    return this.receptions.find().exec();
  }
  async findReception(id: string) {
    const record = await this.receptions.findOne(idFilter(id)).exec();
    if (!record)
      throw new NotFoundException('Réception de lingots introuvable');
    return record;
  }
  async updateReception(id: string, data: UpdateReceptionLingotDto) {
    const record = await this.receptions
      .findOneAndUpdate(idFilter(id), data, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!record)
      throw new NotFoundException('Réception de lingots introuvable');
    return record;
  }
  async removeReception(id: string) {
    const record = await this.receptions.findOneAndDelete(idFilter(id)).exec();
    if (!record)
      throw new NotFoundException('Réception de lingots introuvable');
    return record;
  }

  createEtatStock(data: CreateEtatStockJournalierDto) {
    return this.etatsStock.create(data);
  }
  findEtatsStock() {
    return this.etatsStock.find().exec();
  }
  async findEtatStock(id: string) {
    const record = await this.etatsStock.findOne(idFilter(id)).exec();
    if (!record) throw new NotFoundException('État de stock introuvable');
    return record;
  }
  async updateEtatStock(id: string, data: UpdateEtatStockJournalierDto) {
    const record = await this.etatsStock
      .findOneAndUpdate(idFilter(id), data, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!record) throw new NotFoundException('État de stock introuvable');
    return record;
  }
  async removeEtatStock(id: string) {
    const record = await this.etatsStock.findOneAndDelete(idFilter(id)).exec();
    if (!record) throw new NotFoundException('État de stock introuvable');
    return record;
  }

  createMouvement(data: CreateMouvementLingotDto) {
    return this.mouvements.create(data);
  }
  findMouvements() {
    return this.mouvements.find().exec();
  }
  async findMouvement(id: string) {
    const record = await this.mouvements.findOne(idFilter(id)).exec();
    if (!record) throw new NotFoundException('Mouvement introuvable');
    return record;
  }
  async updateMouvement(id: string, data: UpdateMouvementLingotDto) {
    const record = await this.mouvements
      .findOneAndUpdate(idFilter(id), data, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!record) throw new NotFoundException('Mouvement introuvable');
    return record;
  }
  async removeMouvement(id: string) {
    const record = await this.mouvements.findOneAndDelete(idFilter(id)).exec();
    if (!record) throw new NotFoundException('Mouvement introuvable');
    return record;
  }

  createBilan(data: CreateBilanLingotsJourDto) {
    return this.bilans.create(data);
  }
  findBilans() {
    return this.bilans.find().exec();
  }
  async findBilan(id: string) {
    const record = await this.bilans.findOne(idFilter(id)).exec();
    if (!record) throw new NotFoundException('Bilan journalier introuvable');
    return record;
  }
  async updateBilan(id: string, data: UpdateBilanLingotsJourDto) {
    const record = await this.bilans
      .findOneAndUpdate(idFilter(id), data, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!record) throw new NotFoundException('Bilan journalier introuvable');
    return record;
  }
  async removeBilan(id: string) {
    const record = await this.bilans.findOneAndDelete(idFilter(id)).exec();
    if (!record) throw new NotFoundException('Bilan journalier introuvable');
    return record;
  }
}
