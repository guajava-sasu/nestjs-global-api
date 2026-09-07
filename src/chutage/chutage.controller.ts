import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChutageService } from './chutage.service.js';

@Controller('chutage')
export class ChutageController {
  constructor(private readonly chutageService: ChutageService) {}

  @Get('chariots')
  findChariots() {
    return this.chutageService.findChariots();
  }

  @Get('demandes-pontier')
  findDemandesPontier() {
    return this.chutageService.findDemandesPontier();
  }

  @Get('preparations-chargement')
  findPreparationsChargement() {
    return this.chutageService.findPreparationsChargement();
  }

  @Get('bobines-stockage')
  findBobinesStockage(@Query('type') type?: string) {
    return this.chutageService.findBobinesStockage(type);
  }

  @Get('bobines-a-chuter')
  findBobinesAChuter() {
    return this.chutageService.findBobinesAChuter();
  }

  @Get('chutes-bobines/:bobine')
  findChutesBobines(@Param('bobine') bobine: string) {
    return this.chutageService.findChutesBobines(bobine);
  }

  @Get('chutes-rives/:bobine')
  findChutesRives(@Param('bobine') bobine: string) {
    return this.chutageService.findChutesRives(bobine);
  }

  @Get('ponts-etat-pince')
  findPontsEtatPince() {
    return this.chutageService.findPontsEtatPince();
  }
}