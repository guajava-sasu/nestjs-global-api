import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFicheBobineMereDto } from './dto/create-fiche-bobine-mere.dto.js';
import { UpdateFicheBobineMereDto } from './dto/update-fiche-bobine-mere.dto.js';
import {
  FicheBobineMere,
  FicheBobineMereDocument,
} from './entities/fiche-bobine-mere.entity.js';

@Injectable()
export class FicheBobineMereService {
  constructor(
    @InjectModel(FicheBobineMere.name)
    private readonly ficheBobineMereModel: Model<FicheBobineMereDocument>,
  ) {}

  create(createFicheBobineMereDto: CreateFicheBobineMereDto) {
    return this.ficheBobineMereModel.create(createFicheBobineMereDto);
  }

  findAll() {
    return this.ficheBobineMereModel.find().exec();
  }

  async findOne(bobine: string) {
    const fiche = await this.ficheBobineMereModel.findOne({ bobine }).exec();
    if (!fiche) {
      throw new NotFoundException(`Fiche bobine mère "${bobine}" introuvable`);
    }
    return fiche;
  }

  async update(bobine: string, updateFicheBobineMereDto: UpdateFicheBobineMereDto) {
    const fiche = await this.ficheBobineMereModel
      .findOneAndUpdate({ bobine }, updateFicheBobineMereDto, { new: true })
      .exec();
    if (!fiche) {
      throw new NotFoundException(`Fiche bobine mère "${bobine}" introuvable`);
    }
    return fiche;
  }

  async remove(bobine: string) {
    const fiche = await this.ficheBobineMereModel.findOneAndDelete({ bobine }).exec();
    if (!fiche) {
      throw new NotFoundException(`Fiche bobine mère "${bobine}" introuvable`);
    }
    return fiche;
  }
}
