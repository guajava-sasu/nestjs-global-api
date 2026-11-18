import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ParcABobinesService } from './parc-a-bobines.service.js';
import { DestructiveOperationsGuard } from '../common/guards/destructive-operations.guard.js';
import { CreateParcABobineDto } from './dto/create-parc-a-bobine.dto.js';
import { UpdateParcABobineDto } from './dto/update-parc-a-bobine.dto.js';

@ApiTags('parc-a-bobines')
@Controller('parc-a-bobines')
export class ParcABobinesController {
  constructor(private readonly parcABobinesService: ParcABobinesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une entrée du parc à bobines' })
  @ApiCreatedResponse({ description: 'Entrée créée avec succès' })
  create(@Body() createParcABobineDto: CreateParcABobineDto) {
    return this.parcABobinesService.create(createParcABobineDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister le parc à bobines' })
  @ApiOkResponse({ description: 'Liste du parc à bobines' })
  findAll() {
    return this.parcABobinesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une entrée du parc à bobines par id' })
  @ApiParam({ name: 'id', description: 'Identifiant de la bobine' })
  @ApiOkResponse({ description: 'Entrée trouvée' })
  @ApiNotFoundResponse({ description: 'Entrée introuvable' })
  findOne(@Param('id') id: string) {
    return this.parcABobinesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une entrée du parc à bobines' })
  @ApiParam({ name: 'id', description: 'Identifiant de la bobine' })
  @ApiOkResponse({ description: 'Entrée mise à jour' })
  @ApiNotFoundResponse({ description: 'Entrée introuvable' })
  update(@Param('id') id: string, @Body() updateParcABobineDto: UpdateParcABobineDto) {
    return this.parcABobinesService.update(id, updateParcABobineDto);
  }

  @UseGuards(DestructiveOperationsGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une entrée du parc à bobines' })
  @ApiParam({ name: 'id', description: 'Identifiant de la bobine' })
  @ApiOkResponse({ description: 'Entrée supprimée' })
  @ApiNotFoundResponse({ description: 'Entrée introuvable' })
  remove(@Param('id') id: string) {
    return this.parcABobinesService.remove(id);
  }
}
