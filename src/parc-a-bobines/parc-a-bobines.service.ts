import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateParcABobineDto } from './dto/create-parc-a-bobine.dto.js';
import { UpdateParcABobineDto } from './dto/update-parc-a-bobine.dto.js';
import {
  ParcABobine,
  ParcABobineDocument,
} from './entities/parc-a-bobine.entity.js';

@Injectable()
export class ParcABobinesService {
  constructor(
    @InjectModel(ParcABobine.name)
    private readonly parcABobineModel: Model<ParcABobineDocument>,
  ) {}

  create(createParcABobineDto: CreateParcABobineDto) {
    return this.parcABobineModel.create(createParcABobineDto);
  }

  findAll() {
    return this.parcABobineModel.find().exec();
  }

  async findOne(bobine: string) {
    const parcABobine = await this.parcABobineModel.findOne({ bobine }).exec();
    if (!parcABobine) {
      throw new NotFoundException(`Bobine "${bobine}" introuvable dans le parc à bobines`);
    }
    return parcABobine;
  }

  async update(bobine: string, updateParcABobineDto: UpdateParcABobineDto) {
    const parcABobine = await this.parcABobineModel
      .findOneAndUpdate({ bobine }, updateParcABobineDto, { new: true })
      .exec();
    if (!parcABobine) {
      throw new NotFoundException(`Bobine "${bobine}" introuvable dans le parc à bobines`);
    }
    return parcABobine;
  }

  async remove(bobine: string) {
    const parcABobine = await this.parcABobineModel.findOneAndDelete({ bobine }).exec();
    if (!parcABobine) {
      throw new NotFoundException(`Bobine "${bobine}" introuvable dans le parc à bobines`);
    }
    return parcABobine;
  }
}
