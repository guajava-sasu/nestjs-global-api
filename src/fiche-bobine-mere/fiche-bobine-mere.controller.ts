import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { FicheBobineMereService } from './fiche-bobine-mere.service.js';
import { DestructiveOperationsGuard } from '../common/guards/destructive-operations.guard.js';
import { CreateFicheBobineMereDto } from './dto/create-fiche-bobine-mere.dto.js';
import { UpdateFicheBobineMereDto } from './dto/update-fiche-bobine-mere.dto.js';

@ApiTags('fiche-bobine-mere')
@Controller('fiche-bobine-mere')
export class FicheBobineMereController {
  constructor(private readonly ficheBobineMereService: FicheBobineMereService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une fiche bobine mère' })
  @ApiCreatedResponse({ description: 'Fiche créée avec succès' })
  create(@Body() createFicheBobineMereDto: CreateFicheBobineMereDto) {
    return this.ficheBobineMereService.create(createFicheBobineMereDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les fiches bobine mère' })
  @ApiOkResponse({ description: 'Liste des fiches bobine mère' })
  findAll() {
    return this.ficheBobineMereService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une fiche bobine mère par id' })
  @ApiParam({ name: 'id', description: 'Identifiant de la fiche bobine mère' })
  @ApiOkResponse({ description: 'Fiche trouvée' })
  @ApiNotFoundResponse({ description: 'Fiche introuvable' })
  findOne(@Param('id') id: string) {
    return this.ficheBobineMereService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une fiche bobine mère' })
  @ApiParam({ name: 'id', description: 'Identifiant de la fiche bobine mère' })
  @ApiOkResponse({ description: 'Fiche mise à jour' })
  @ApiNotFoundResponse({ description: 'Fiche introuvable' })
  update(@Param('id') id: string, @Body() updateFicheBobineMereDto: UpdateFicheBobineMereDto) {
    return this.ficheBobineMereService.update(id, updateFicheBobineMereDto);
  }

  @UseGuards(DestructiveOperationsGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une fiche bobine mère' })
  @ApiParam({ name: 'id', description: 'Identifiant de la fiche bobine mère' })
  @ApiOkResponse({ description: 'Fiche supprimée' })
  @ApiNotFoundResponse({ description: 'Fiche introuvable' })
  remove(@Param('id') id: string) {
    return this.ficheBobineMereService.remove(id);
  }
}
