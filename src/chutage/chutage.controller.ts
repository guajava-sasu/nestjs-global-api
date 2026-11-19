import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { ChutageService } from './chutage.service.js';
import {
  BobineAChuterResponseDto, BobineStockageResponseDto, ChariotResponseDto,
  ChuteRiveResponseDto, DemandePontierResponseDto, DetailChuteBobineResponseDto,
  PontEtatPinceResponseDto, PreparationChargementResponseDto,
} from './dto/chutage-response.dto.js';

@ApiTags('chutage')
@Controller('chutage')
export class ChutageController {
  constructor(private readonly chutageService: ChutageService) { }

  @Get('chariots')
  @ApiOperation({ summary: 'Lister les chariots' })
  @ApiOkResponse({ type: [ChariotResponseDto], description: 'Liste des chariots' })
  findChariots() {
    return this.chutageService.findChariots();
  }

  @Get('demandes-pontier')
  @ApiOperation({ summary: 'Lister les demandes pontier' })
  @ApiOkResponse({ type: [DemandePontierResponseDto], description: 'Liste des demandes pontier' })
  findDemandesPontier() {
    return this.chutageService.findDemandesPontier();
  }

  @Get('preparations-chargement')
  @ApiOperation({ summary: 'Lister les préparations de chargement' })
  @ApiOkResponse({ type: [PreparationChargementResponseDto], description: 'Liste des préparations de chargement' })
  findPreparationsChargement() {
    return this.chutageService.findPreparationsChargement();
  }

  @Get('bobines-stockage')
  @ApiOperation({ summary: 'Lister les bobines en stockage' })
  @ApiQuery({ name: 'type', type: String, required: false, description: "Filtre exact, généralement N ou S. Omis ou vide : aucun filtre." })
  @ApiOkResponse({ type: [BobineStockageResponseDto], description: 'Liste des bobines en stockage' })
  findBobinesStockage(@Query('type') type?: string) {
    return this.chutageService.findBobinesStockage(type);
  }

  @Get('bobines-a-chuter')
  @ApiOperation({ summary: 'Lister les bobines à chuter' })
  @ApiOkResponse({ type: [BobineAChuterResponseDto], description: 'Liste des bobines à chuter' })
  findBobinesAChuter() {
    return this.chutageService.findBobinesAChuter();
  }

  @Get('chutes-bobines/:bobine')
  @ApiOperation({ summary: "Lister les chutes d'une bobine" })
  @ApiParam({ name: 'bobine', description: 'Identifiant de la bobine' })
  @ApiOkResponse({ type: [DetailChuteBobineResponseDto], description: 'Liste des chutes de la bobine' })
  findChutesBobines(@Param('bobine') bobine: string) {
    return this.chutageService.findChutesBobines(bobine);
  }

  @Get('chutes')
  @ApiOperation({ summary: "Lister toutes les chutes" })
  @ApiOkResponse({ type: [DetailChuteBobineResponseDto], description: 'Liste de toutes les chutes' })
  findChutes() {
    return this.chutageService.findChutes();
  }

  @Get('chutes-rives/:bobine')
  @ApiOperation({ summary: "Lister les chutes de rives d'une bobine" })
  @ApiParam({ name: 'bobine', description: 'Identifiant de la bobine' })
  @ApiOkResponse({ type: [ChuteRiveResponseDto], description: 'Liste des chutes de rives de la bobine' })
  findChutesRives(@Param('bobine') bobine: string) {
    return this.chutageService.findChutesRives(bobine);
  }

  @Get('chutes-rives')
  @ApiOperation({ summary: "Lister toutes les chutes de rives" })
  @ApiOkResponse({ type: [ChuteRiveResponseDto], description: 'Liste de toutes les chutes de rives' })
  findAllChutesRives() {
    return this.chutageService.findAllChutesRives();
  }

  @Get('ponts-etat-pince')
  @ApiOperation({ summary: "Lister l'état des ponts et pinces" })
  @ApiOkResponse({ type: [PontEtatPinceResponseDto], description: 'Liste des états ponts/pinces' })
  findPontsEtatPince() {
    return this.chutageService.findPontsEtatPince();
  }
}