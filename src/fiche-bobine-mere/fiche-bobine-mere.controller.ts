import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FicheBobineMereService } from './fiche-bobine-mere.service.js';
import { CreateFicheBobineMereDto } from './dto/create-fiche-bobine-mere.dto.js';
import { UpdateFicheBobineMereDto } from './dto/update-fiche-bobine-mere.dto.js';

@Controller('fiche-bobine-mere')
export class FicheBobineMereController {
  constructor(private readonly ficheBobineMereService: FicheBobineMereService) {}

  @Post()
  create(@Body() createFicheBobineMereDto: CreateFicheBobineMereDto) {
    return this.ficheBobineMereService.create(createFicheBobineMereDto);
  }

  @Get()
  findAll() {
    return this.ficheBobineMereService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ficheBobineMereService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFicheBobineMereDto: UpdateFicheBobineMereDto) {
    return this.ficheBobineMereService.update(id, updateFicheBobineMereDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ficheBobineMereService.remove(id);
  }
}
