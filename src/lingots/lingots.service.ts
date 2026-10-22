import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateBilanLingotsJourDto,
  CreateEtatStockJournalierDto,
  CreateLigneReceptionLingotDto,
  CreateLingotStockDto,
  CreateLivraisonFournisseurDto,
  CreateMouvementLingotDto,
  UpdateBilanLingotsJourDto,
  UpdateEtatStockJournalierDto,
  UpdateLigneReceptionLingotDto,
  UpdateLingotStockDto,
  UpdateLivraisonFournisseurDto,
  UpdateMouvementLingotDto,
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
} from './entities/lingot.entity.js';

@Injectable()
export class LingotsService {
  constructor(
    @InjectModel(LingotStockRecord.name)
    private readonly lingots: Model<LingotStockDocument>,
    @InjectModel(LivraisonFournisseurRecord.name)
    private readonly livraisons: Model<LivraisonFournisseurDocument>,
    @InjectModel(LigneReceptionLingotRecord.name)
    private readonly lignesReception: Model<LigneReceptionLingotDocument>,
    @InjectModel(EtatStockJournalierRecord.name)
    private readonly etatsStock: Model<EtatStockJournalierDocument>,
    @InjectModel(MouvementLingotRecord.name)
    private readonly mouvements: Model<MouvementLingotDocument>,
    @InjectModel(BilanLingotsJourRecord.name)
    private readonly bilans: Model<BilanLingotsJourDocument>,
  ) {}

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
    const record = await this.livraisons.findById(id).exec();
    if (!record) throw new NotFoundException('Livraison introuvable');
    return record;
  }
  async updateLivraison(id: string, data: UpdateLivraisonFournisseurDto) {
    const record = await this.livraisons
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
    if (!record) throw new NotFoundException('Livraison introuvable');
    return record;
  }
  async removeLivraison(id: string) {
    const record = await this.livraisons.findByIdAndDelete(id).exec();
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
    const record = await this.lignesReception.findById(id).exec();
    if (!record) throw new NotFoundException('Ligne de réception introuvable');
    return record;
  }
  async updateLigneReception(id: string, data: UpdateLigneReceptionLingotDto) {
    const record = await this.lignesReception
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
    if (!record) throw new NotFoundException('Ligne de réception introuvable');
    return record;
  }
  async removeLigneReception(id: string) {
    const record = await this.lignesReception.findByIdAndDelete(id).exec();
    if (!record) throw new NotFoundException('Ligne de réception introuvable');
    return record;
  }

  createEtatStock(data: CreateEtatStockJournalierDto) {
    return this.etatsStock.create(data);
  }
  findEtatsStock() {
    return this.etatsStock.find().exec();
  }
  async findEtatStock(id: string) {
    const record = await this.etatsStock.findById(id).exec();
    if (!record) throw new NotFoundException('État de stock introuvable');
    return record;
  }
  async updateEtatStock(id: string, data: UpdateEtatStockJournalierDto) {
    const record = await this.etatsStock
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
    if (!record) throw new NotFoundException('État de stock introuvable');
    return record;
  }
  async removeEtatStock(id: string) {
    const record = await this.etatsStock.findByIdAndDelete(id).exec();
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
    const record = await this.mouvements.findById(id).exec();
    if (!record) throw new NotFoundException('Mouvement introuvable');
    return record;
  }
  async updateMouvement(id: string, data: UpdateMouvementLingotDto) {
    const record = await this.mouvements
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
    if (!record) throw new NotFoundException('Mouvement introuvable');
    return record;
  }
  async removeMouvement(id: string) {
    const record = await this.mouvements.findByIdAndDelete(id).exec();
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
    const record = await this.bilans.findById(id).exec();
    if (!record) throw new NotFoundException('Bilan journalier introuvable');
    return record;
  }
  async updateBilan(id: string, data: UpdateBilanLingotsJourDto) {
    const record = await this.bilans
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
    if (!record) throw new NotFoundException('Bilan journalier introuvable');
    return record;
  }
  async removeBilan(id: string) {
    const record = await this.bilans.findByIdAndDelete(id).exec();
    if (!record) throw new NotFoundException('Bilan journalier introuvable');
    return record;
  }
}
