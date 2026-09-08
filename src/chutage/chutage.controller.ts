import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { ChutageService } from './chutage.service.js';

@ApiTags('chutage')
@Controller('chutage')
export class ChutageController {
  constructor(private readonly chutageService: ChutageService) {}

  @Get('chariots')
  @ApiOperation({ summary: 'Lister les chariots' })
  @ApiOkResponse({ description: 'Liste des chariots' })
  findChariots() {
    return this.chutageService.findChariots();
  }

  @Get('demandes-pontier')
  @ApiOperation({ summary: 'Lister les demandes pontier' })
  @ApiOkResponse({ description: 'Liste des demandes pontier' })
  findDemandesPontier() {
    return this.chutageService.findDemandesPontier();
  }

  @Get('preparations-chargement')
  @ApiOperation({ summary: 'Lister les préparations de chargement' })
  @ApiOkResponse({ description: 'Liste des préparations de chargement' })
  findPreparationsChargement() {
    return this.chutageService.findPreparationsChargement();
  }

  @Get('bobines-stockage')
  @ApiOperation({ summary: 'Lister les bobines en stockage' })
  @ApiQuery({ name: 'type', required: false, description: "Type de bobine ('N' ou 'S')" })
  @ApiOkResponse({ description: 'Liste des bobines en stockage' })
  findBobinesStockage(@Query('type') type?: string) {
    return this.chutageService.findBobinesStockage(type);
  }

  @Get('bobines-a-chuter')
  @ApiOperation({ summary: 'Lister les bobines à chuter' })
  @ApiOkResponse({ description: 'Liste des bobines à chuter' })
  findBobinesAChuter() {
    return this.chutageService.findBobinesAChuter();
  }

  @Get('chutes-bobines/:bobine')
  @ApiOperation({ summary: "Lister les chutes d'une bobine" })
  @ApiParam({ name: 'bobine', description: 'Identifiant de la bobine' })
  @ApiOkResponse({ description: 'Liste des chutes de la bobine' })
  findChutesBobines(@Param('bobine') bobine: string) {
    return this.chutageService.findChutesBobines(bobine);
  }

  @Get('chutes-rives/:bobine')
  @ApiOperation({ summary: "Lister les chutes de rives d'une bobine" })
  @ApiParam({ name: 'bobine', description: 'Identifiant de la bobine' })
  @ApiOkResponse({ description: 'Liste des chutes de rives de la bobine' })
  findChutesRives(@Param('bobine') bobine: string) {
    return this.chutageService.findChutesRives(bobine);
  }

  @Get('ponts-etat-pince')
  @ApiOperation({ summary: "Lister l'état des ponts et pinces" })
  @ApiOkResponse({ description: 'Liste des états ponts/pinces' })
  findPontsEtatPince() {
    return this.chutageService.findPontsEtatPince();
  }
}