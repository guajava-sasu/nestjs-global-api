import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParcABobinesService } from './parc-a-bobines.service.js';
import { CreateParcABobineDto } from './dto/create-parc-a-bobine.dto.js';
import { UpdateParcABobineDto } from './dto/update-parc-a-bobine.dto.js';

@Controller('parc-a-bobines')
export class ParcABobinesController {
  constructor(private readonly parcABobinesService: ParcABobinesService) {}

  @Post()
  create(@Body() createParcABobineDto: CreateParcABobineDto) {
    return this.parcABobinesService.create(createParcABobineDto);
  }

  @Get()
  findAll() {
    return this.parcABobinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parcABobinesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParcABobineDto: UpdateParcABobineDto) {
    return this.parcABobinesService.update(id, updateParcABobineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parcABobinesService.remove(id);
  }
}
