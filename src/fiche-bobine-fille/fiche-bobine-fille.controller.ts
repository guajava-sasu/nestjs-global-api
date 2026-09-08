import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { FicheBobineFilleService } from './fiche-bobine-fille.service.js';
import { CreateFicheBobineFilleDto } from './dto/create-fiche-bobine-fille.dto.js';
import { UpdateFicheBobineFilleDto } from './dto/update-fiche-bobine-fille.dto.js';

@ApiTags('fiche-bobine-fille')
@Controller('fiche-bobine-fille')
export class FicheBobineFilleController {
  constructor(private readonly ficheBobineFilleService: FicheBobineFilleService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une fiche bobine fille' })
  @ApiCreatedResponse({ description: 'Fiche créée avec succès' })
  create(@Body() createFicheBobineFilleDto: CreateFicheBobineFilleDto) {
    return this.ficheBobineFilleService.create(createFicheBobineFilleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les fiches bobine fille' })
  @ApiOkResponse({ description: 'Liste des fiches bobine fille' })
  findAll() {
    return this.ficheBobineFilleService.findAll();
  }

  @Get('bobine-mere/:identiteBobineMere')
  @ApiOperation({ summary: "Lister les fiches filles d'une bobine mère" })
  @ApiParam({ name: 'identiteBobineMere', description: 'Numéro de la bobine mère' })
  @ApiOkResponse({ description: 'Liste des fiches filles de la bobine mère' })
  findByBobineMere(@Param('identiteBobineMere') identiteBobineMere: string) {
    return this.ficheBobineFilleService.findByBobineMere(identiteBobineMere);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une fiche bobine fille par id' })
  @ApiParam({ name: 'id', description: 'Identifiant de la fiche bobine fille' })
  @ApiOkResponse({ description: 'Fiche trouvée' })
  @ApiNotFoundResponse({ description: 'Fiche introuvable' })
  findOne(@Param('id') id: string) {
    return this.ficheBobineFilleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une fiche bobine fille' })
  @ApiParam({ name: 'id', description: 'Identifiant de la fiche bobine fille' })
  @ApiOkResponse({ description: 'Fiche mise à jour' })
  @ApiNotFoundResponse({ description: 'Fiche introuvable' })
  update(@Param('id') id: string, @Body() updateFicheBobineFilleDto: UpdateFicheBobineFilleDto) {
    return this.ficheBobineFilleService.update(id, updateFicheBobineFilleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une fiche bobine fille' })
  @ApiParam({ name: 'id', description: 'Identifiant de la fiche bobine fille' })
  @ApiOkResponse({ description: 'Fiche supprimée' })
  @ApiNotFoundResponse({ description: 'Fiche introuvable' })
  remove(@Param('id') id: string) {
    return this.ficheBobineFilleService.remove(id);
  }
}
