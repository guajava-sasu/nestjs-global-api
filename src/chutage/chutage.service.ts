import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BobineAChuter,
  BobineStockage,
  Chariot,
  ChuteRive,
  DemandePontier,
  DetailChuteBobine,
  PontEtatPince,
  PreparationChargement,
} from './entities/chutage.entity.js';

@Injectable()
export class ChutageService implements OnModuleInit {
  constructor(
    @InjectModel(Chariot.name) private readonly chariotModel: Model<Chariot>,
    @InjectModel(DemandePontier.name) private readonly demandePontierModel: Model<DemandePontier>,
    @InjectModel(PreparationChargement.name) private readonly preparationModel: Model<PreparationChargement>,
    @InjectModel(BobineStockage.name) private readonly stockageModel: Model<BobineStockage>,
    @InjectModel(BobineAChuter.name) private readonly bobineAChuterModel: Model<BobineAChuter>,
    @InjectModel(DetailChuteBobine.name) private readonly chuteBobineModel: Model<DetailChuteBobine>,
    @InjectModel(ChuteRive.name) private readonly chuteRiveModel: Model<ChuteRive>,
    @InjectModel(PontEtatPince.name) private readonly pontEtatPinceModel: Model<PontEtatPince>,
  ) {}

  async onModuleInit() {
    await Promise.all([
      this.seed(this.chariotModel, [{ numero: 4, bobine: '' }, { numero: 3, bobine: '' }, { numero: 2, bobine: '' }, { numero: 1, bobine: '55964300' }]),
      this.seed(this.demandePontierModel, [{ sens: 'Chargement', bobine: '55906300', halle: 'H11', chariot: '3' }, { sens: 'Dechargement', bobine: '', halle: '', chariot: '' }]),
      this.seed(this.preparationModel, [{ bobine: '54907900', halle: 'H11', chariot: 2 }, { bobine: '55989200', halle: 'H11', chariot: 4 }, { bobine: '', halle: 'N/A', chariot: null }, { bobine: ' ', halle: 'N/A', chariot: null }]),
      this.seed(this.stockageModel, stockageInitial),
      this.seed(this.bobineAChuterModel, bobinesAChuterInitiales),
      this.seed(this.chuteBobineModel, chutesBobinesInitiales),
      this.seed(this.chuteRiveModel, chutesRivesInitiales),
      this.seed(this.pontEtatPinceModel, [{ pont: { id: 1, name: 'P11', color: 'transparent' }, etat: { id: 0, name: 'AUTO', color: 'transparent' }, pince: '' }, { pont: { id: 0, name: 'H3', color: 'transparent' }, etat: { id: 1, name: 'MANUEL', color: 'red' }, pince: '012345678' }]),
    ]);
  }

  findChariots() {
    return this.chariotModel.find().sort({ numero: -1 }).exec();
  }

  findDemandesPontier() {
    return this.demandePontierModel.find().exec();
  }

  findPreparationsChargement() {
    return this.preparationModel.find().exec();
  }

  findBobinesStockage(type?: string) {
    return this.stockageModel.find(type ? { type } : {}).exec();
  }

  findBobinesAChuter() {
    return this.bobineAChuterModel.find().exec();
  }

  findChutesBobines(bobine: string) {
    return this.chuteBobineModel.find({ bobine }).sort({ position: 1 }).exec();
  }

  findChutesRives(bobine: string) {
    return this.chuteRiveModel.find({ bobine }).exec();
  }

  findPontsEtatPince() {
    return this.pontEtatPinceModel.find().exec();
  }

  async updateDatabase() {
    await Promise.all([
      this.chariotModel.deleteMany({}),
      this.demandePontierModel.deleteMany({}),
      this.preparationModel.deleteMany({}),
      this.stockageModel.deleteMany({}),
      this.bobineAChuterModel.deleteMany({}),
      this.chuteBobineModel.deleteMany({}),
      this.chuteRiveModel.deleteMany({}),
      this.pontEtatPinceModel.deleteMany({}),
    ]);
    await this.onModuleInit();
  }

  private async seed<T>(model: Model<T>, documents: object[]) {
    if (await model.exists({})) return;
    await model.insertMany(documents);
  }
}

const stockageInitial = [
  { type: 'N', bobine: '34993301', lot: '57297', montage: 49, largeur: '1439,0', epaisseur: 389, poids: 12764, cycle: '4O3', prod: 'GCR', diametre: 1345, halle: 'H11', client: 'MARCOR CUGGION0', priorite: 'P' },
  { type: 'S', bobine: '35415201', lot: '64310', montage: 49, largeur: '1346,8', epaisseur: 391, poids: 20560, cycle: '6L9', prod: 'GCR', diametre: 1702, halle: 'H11', client: 'VERGAL OUDEN', priorite: 'P' },
  { type: 'N', bobine: '34968301', lot: '54914', montage: 49, largeur: '1274,8', epaisseur: 366, poids: 15640, cycle: '6L9', prod: 'GCR', diametre: 1547, halle: 'H11', client: 'VERGAL OUDEN', priorite: 'P' },
  { type: 'N', bobine: '34993300', lot: '57297', montage: 49, largeur: '1439,0', epaisseur: 389, poids: 12764, cycle: '4O3', prod: 'GCR', diametre: 1345, halle: 'H11', client: 'MARCOR CUGGION1', priorite: 'P' },
  { type: 'N', bobine: '35415200', lot: '64310', montage: 49, largeur: '1346,8', epaisseur: 391, poids: 20560, cycle: '6L9', prod: 'GCR', diametre: 1702, halle: 'H11', client: 'VERGAL OUDEN', priorite: 'P' },
  { type: 'S', bobine: '34968300', lot: '54914', montage: 49, largeur: '1274,8', epaisseur: 366, poids: 15640, cycle: '6L9', prod: 'GCR', diametre: 1547, halle: 'H11', client: 'VERGAL OUDEN', priorite: 'P' },
  { type: 'S', bobine: '35423300', lot: '54914', montage: 49, largeur: '1274,5', epaisseur: 366, poids: 19080, cycle: '6L9', prod: 'GCR', diametre: 1687, halle: 'H11', client: 'VERGAL OUDEN', priorite: 'P' },
  { type: 'S', bobine: '35187600', lot: '58412', montage: 51, largeur: '1320,0', epaisseur: 375, poids: 14200, cycle: '4O3', prod: 'GCR', diametre: 1410, halle: 'H11', client: 'TATA STEEL', priorite: '' },
  { type: 'S', bobine: '35602400', lot: '65021', montage: 50, largeur: '1285,4', epaisseur: 382, poids: 18750, cycle: '6L9', prod: 'GCR', diametre: 1635, halle: 'H11', client: 'SALZGITTER AG', priorite: '' },
  { type: 'S', bobine: '34871500', lot: '55803', montage: 48, largeur: '1310,2', epaisseur: 358, poids: 16320, cycle: '6L9', prod: 'GCR', diametre: 1580, halle: 'H11', client: 'THYSSENKRUPP', priorite: '' },
  { type: 'S', bobine: '35539700', lot: '56178', montage: 50, largeur: '1298,0', epaisseur: 370, poids: 17450, cycle: '6L9', prod: 'GCR', diametre: 1660, halle: 'H11', client: 'VOESTALPINE', priorite: '' },
  { type: 'N', bobine: '35187601', lot: '58412', montage: 51, largeur: '1320,0', epaisseur: 375, poids: 14200, cycle: '4O3', prod: 'GCR', diametre: 1410, halle: 'H11', client: 'TATA STEEL', priorite: '' },
  { type: 'N', bobine: '35602401', lot: '65021', montage: 50, largeur: '1285,4', epaisseur: 382, poids: 18750, cycle: '6L9', prod: 'GCR', diametre: 1635, halle: 'H11', client: 'SALZGITTER AG', priorite: '' },
  { type: 'N', bobine: '34871501', lot: '55803', montage: 48, largeur: '1310,2', epaisseur: 358, poids: 16320, cycle: '6L9', prod: 'GCR', diametre: 1580, halle: 'H11', client: 'THYSSENKRUPP', priorite: '' },
  { type: 'N', bobine: '35539701', lot: '56178', montage: 50, largeur: '1298,0', epaisseur: 370, poids: 17450, cycle: '6L9', prod: 'GCR', diametre: 1660, halle: 'H11', client: 'VOESTALPINE', priorite: '' },
];

const bobinesAChuterInitiales = [
  { bobine: '33656000', lgE: 5, lgS: 2, fini: '', selected: false }, { bobine: '33390900', lgE: 18, lgS: 3, fini: 'E', selected: true }, { bobine: '33461000', lgE: 11, lgS: 1, fini: 'E', selected: false }, { bobine: '33619800', lgE: 9, lgS: 2, fini: 'B', selected: false }, { bobine: '33607100', lgE: 9, lgS: 2, fini: 'T', selected: false },
  { bobine: '33656001', lgE: 5, lgS: 2, fini: '', selected: false }, { bobine: '33390901', lgE: 18, lgS: 3, fini: 'E', selected: true }, { bobine: '33461001', lgE: 11, lgS: 1, fini: 'E', selected: false }, { bobine: '33619801', lgE: 9, lgS: 2, fini: 'X', selected: false }, { bobine: '33607101', lgE: 9, lgS: 2, fini: 'E', selected: false },
];

const chutesBobinesInitiales = [
  { bobine: '33656000', lieu: 'E', position: 0, longueur: 2, poids: 10, defaut: 'CHT', imp: 31, revAV: 0, revAR: 0 }, { bobine: '33656000', lieu: 'S', position: 2, longueur: 3, poids: 15, defaut: 'HTE', imp: 21, revAV: 0, revAR: 0 },
  { bobine: '33390900', lieu: 'E', position: 0, longueur: 3, poids: 15, defaut: 'CHT', imp: 31, revAV: 0, revAR: 0 }, { bobine: '33390900', lieu: 'S', position: 3, longueur: 15, poids: null, defaut: 'HTE', imp: 31, revAV: 0, revAR: 0 }, { bobine: '33390900', lieu: 'S', position: 6, longueur: 1, poids: 5, defaut: 'CHT', imp: 31, revAV: 73, revAR: 73 }, { bobine: '33390900', lieu: 'S', position: 4770, longueur: 2, poids: 10, defaut: 'CHT', imp: 31, revAV: 104, revAR: 104 }, { bobine: '33390900', lieu: 'E', position: 4772, longueur: 5, poids: 24, defaut: 'ICE', imp: 31, revAV: 0, revAR: 0 }, { bobine: '33390900', lieu: 'E', position: 4777, longueur: 1, poids: 5, defaut: 'HTE', imp: 21, revAV: 0, revAR: 0 }, { bobine: '33390900', lieu: 'E', position: 4778, longueur: 6, poids: 29, defaut: 'CHT', imp: 31, revAV: 0, revAR: 0 },
  { bobine: '33461000', lieu: 'E', position: 0, longueur: 5, poids: 25, defaut: 'CHT', imp: 31, revAV: 0, revAR: 0 }, { bobine: '33461000', lieu: 'S', position: 5, longueur: 6, poids: 30, defaut: 'ICE', imp: 31, revAV: 80, revAR: 80 }, { bobine: '33619800', lieu: 'E', position: 0, longueur: 4, poids: 20, defaut: 'CHT', imp: 31, revAV: 0, revAR: 0 }, { bobine: '33619800', lieu: 'S', position: 4, longueur: 5, poids: null, defaut: 'HTE', imp: 21, revAV: 0, revAR: 0 }, { bobine: '33619800', lieu: 'E', position: 3200, longueur: 3, poids: 15, defaut: 'CHT', imp: 31, revAV: 95, revAR: 95 }, { bobine: '33607100', lieu: 'S', position: 0, longueur: 7, poids: 35, defaut: 'CHT', imp: 31, revAV: 0, revAR: 0 }, { bobine: '33607100', lieu: 'E', position: 7, longueur: 2, poids: 10, defaut: 'HTE', imp: 21, revAV: 0, revAR: 0 },
];

const chutesRivesInitiales = [
  { bobine: '33656000', lieu: 'S', largeur: 20, longueur: 3800, poids: 380, defaut: 'CHR', imp: 31, revAV: 68, revAR: 68 }, { bobine: '33390900', lieu: 'S', largeur: 26, longueur: 4840, poids: 505, defaut: 'CHR', imp: 31, revAV: 72, revAR: 72 }, { bobine: '33461000', lieu: 'S', largeur: 22, longueur: 4100, poids: 420, defaut: 'CHR', imp: 31, revAV: 75, revAR: 75 }, { bobine: '33461002', lieu: 'E', largeur: 18, longueur: 4100, poids: 350, defaut: 'CHR', imp: 21, revAV: 0, revAR: 0 }, { bobine: '33619800', lieu: 'S', largeur: 24, longueur: 4500, poids: 460, defaut: 'CHR', imp: 31, revAV: 70, revAR: 70 }, { bobine: '33607102', lieu: 'S', largeur: 28, longueur: 5100, poids: 550, defaut: 'CHR', imp: 31, revAV: 78, revAR: 78 },
];