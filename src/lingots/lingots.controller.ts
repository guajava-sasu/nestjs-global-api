import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { DestructiveOperationsGuard } from '../common/guards/destructive-operations.guard.js';
import {
  ApiCreation,
  ApiElement,
  ApiListe,
} from './api-reponses.decorators.js';
import {
  ConfigurationResponseDto,
  FournisseurResponseDto,
  HistoriqueStockResponseDto,
  InventaireResponseDto,
  LingotResponseDto,
  MatteResponseDto,
  MouvementResponseDto,
  OperateurResponseDto,
  TauxAluminiumResponseDto,
  ZoneResponseDto,
} from './dto/lingot-response.dto.js';
import {
  CreateConfigurationDto,
  CreateFournisseurDto,
  CreateHistoriqueStockDto,
  CreateInventaireDto,
  CreateLingotDto,
  CreateMatteDto,
  CreateMouvementCollectionDto,
  CreateMouvementDto,
  CreateOperateurDto,
  CreateTauxAluminiumDto,
  TypeZoneDto,
  UpdateConfigurationDto,
  UpdateFournisseurDto,
  UpdateHistoriqueStockDto,
  UpdateInventaireDto,
  UpdateLingotDto,
  UpdateMatteDto,
  UpdateMouvementDto,
  UpdateOperateurDto,
  UpdateTauxAluminiumDto,
  UpdateZoneDto,
  ZoneDto,
} from './dto/lingot.dto.js';
import { LingotsService } from './lingots.service.js';

@ApiTags('lingots')
@Controller()
export class LingotsController {
  constructor(private readonly lingotsService: LingotsService) {}

  @ApiCreation(ConfigurationResponseDto)
  @Post('configuration')
  createConfiguration(@Body() body: CreateConfigurationDto) {
    return this.lingotsService.createConfiguration(body);
  }
  @ApiListe(ConfigurationResponseDto)
  @Get('configuration')
  findConfigurations() {
    return this.lingotsService.findConfigurations();
  }
  @ApiElement(ConfigurationResponseDto)
  @Get('configuration/:id')
  findConfiguration(@Param('id') id: string) {
    return this.lingotsService.findConfiguration(id);
  }
  @ApiElement(ConfigurationResponseDto)
  @Patch('configuration/:id')
  updateConfiguration(
    @Param('id') id: string,
    @Body() body: UpdateConfigurationDto,
  ) {
    return this.lingotsService.updateConfiguration(id, body);
  }
  @ApiElement(ConfigurationResponseDto)
  @UseGuards(DestructiveOperationsGuard)
  @Delete('configuration/:id')
  removeConfiguration(@Param('id') id: string) {
    return this.lingotsService.removeConfiguration(id);
  }

  @ApiCreation(OperateurResponseDto)
  @Post('operateurs-lingots')
  createOperateur(@Body() body: CreateOperateurDto) {
    return this.lingotsService.createOperateur(body);
  }
  @ApiListe(OperateurResponseDto)
  @Get('operateurs-lingots')
  findOperateurs() {
    return this.lingotsService.findOperateurs();
  }
  @ApiElement(OperateurResponseDto)
  @Get('operateurs-lingots/:id')
  findOperateur(@Param('id') id: string) {
    return this.lingotsService.findOperateur(id);
  }
  @ApiElement(OperateurResponseDto)
  @Patch('operateurs-lingots/:id')
  updateOperateur(@Param('id') id: string, @Body() body: UpdateOperateurDto) {
    return this.lingotsService.updateOperateur(id, body);
  }
  @ApiElement(OperateurResponseDto)
  @UseGuards(DestructiveOperationsGuard)
  @Delete('operateurs-lingots/:id')
  removeOperateur(@Param('id') id: string) {
    return this.lingotsService.removeOperateur(id);
  }

  @ApiCreation(FournisseurResponseDto)
  @Post('fournisseurs-lingots')
  createFournisseur(@Body() body: CreateFournisseurDto) {
    return this.lingotsService.createFournisseur(body);
  }
  @ApiListe(FournisseurResponseDto)
  @Get('fournisseurs-lingots')
  findFournisseurs() {
    return this.lingotsService.findFournisseurs();
  }
  @ApiElement(FournisseurResponseDto)
  @Get('fournisseurs-lingots/:id')
  findFournisseur(@Param('id') id: string) {
    return this.lingotsService.findFournisseur(id);
  }
  @ApiElement(FournisseurResponseDto)
  @Patch('fournisseurs-lingots/:id')
  updateFournisseur(
    @Param('id') id: string,
    @Body() body: UpdateFournisseurDto,
  ) {
    return this.lingotsService.updateFournisseur(id, body);
  }
  @ApiElement(FournisseurResponseDto)
  @UseGuards(DestructiveOperationsGuard)
  @Delete('fournisseurs-lingots/:id')
  removeFournisseur(@Param('id') id: string) {
    return this.lingotsService.removeFournisseur(id);
  }

  @ApiCreation(TauxAluminiumResponseDto)
  @Post('taux-aluminium-lingots')
  createTauxAluminium(@Body() body: CreateTauxAluminiumDto) {
    return this.lingotsService.createTauxAluminium(body);
  }
  @ApiListe(TauxAluminiumResponseDto)
  @Get('taux-aluminium-lingots')
  findTauxAluminium() {
    return this.lingotsService.findTauxAluminium();
  }
  @ApiElement(TauxAluminiumResponseDto)
  @Get('taux-aluminium-lingots/:id')
  findTauxAluminiumById(@Param('id') id: string) {
    return this.lingotsService.findTauxAluminiumById(id);
  }
  @ApiElement(TauxAluminiumResponseDto)
  @Patch('taux-aluminium-lingots/:id')
  updateTauxAluminium(
    @Param('id') id: string,
    @Body() body: UpdateTauxAluminiumDto,
  ) {
    return this.lingotsService.updateTauxAluminium(id, body);
  }
  @ApiElement(TauxAluminiumResponseDto)
  @UseGuards(DestructiveOperationsGuard)
  @Delete('taux-aluminium-lingots/:id')
  removeTauxAluminium(@Param('id') id: string) {
    return this.lingotsService.removeTauxAluminium(id);
  }

  @ApiListe(TypeZoneDto)
  @Get('types-zones')
  findTypesZone() {
    return this.lingotsService.findTypesZone();
  }

  @ApiCreation(ZoneResponseDto)
  @Post('zones-lingots')
  createZone(@Body() body: ZoneDto) {
    return this.lingotsService.createZone(body);
  }
  @ApiListe(ZoneResponseDto)
  @Get('zones-lingots')
  findZones() {
    return this.lingotsService.findZones();
  }
  @ApiElement(ZoneResponseDto)
  @Get('zones-lingots/type-operation/:operation')
  findZonesByOperationType(@Param('operation') operation: string) {
    return this.lingotsService.findZonesByOperationType(operation);
  }
    @ApiElement(ZoneResponseDto)
  @Get('zones-lingots/:id')
  findZone(@Param('id') id: string) {
    return this.lingotsService.findZone(id);
  }
  @ApiElement(ZoneResponseDto)
  @Patch('zones-lingots/:id')
  updateZone(@Param('id') id: string, @Body() body: UpdateZoneDto) {
    return this.lingotsService.updateZone(id, body);
  }
  @ApiElement(ZoneResponseDto)
  @UseGuards(DestructiveOperationsGuard)
  @Delete('zones-lingots/:id')
  removeZone(@Param('id') id: string) {
    return this.lingotsService.removeZone(id);
  }

  @ApiCreation(LingotResponseDto)
  @Post('lingots')
  createLingot(@Body() body: CreateLingotDto) {
    return this.lingotsService.createLingot(body);
  }
  @ApiListe(LingotResponseDto)
  @Get('lingots')
  findLingots() {
    return this.lingotsService.findLingots();
  }
  @ApiListe(LingotResponseDto)
  @ApiOperation({ summary: 'Lister les lingots purs de démonstration (AL00)' })
  @Get('orphelingots')
  findOrphelingots() {
    return this.lingotsService.findOrphelingots();
  }
  @ApiElement(LingotResponseDto)
  @Get('lingots/:id')
  findLingot(@Param('id') id: string) {
    return this.lingotsService.findLingot(id);
  }
  @ApiElement(LingotResponseDto)
  @Patch('lingots/:id')
  updateLingot(@Param('id') id: string, @Body() body: UpdateLingotDto) {
    return this.lingotsService.updateLingot(id, body);
  }
  @ApiElement(LingotResponseDto)
  @UseGuards(DestructiveOperationsGuard)
  @Delete('lingots/:id')
  removeLingot(@Param('id') id: string) {
    return this.lingotsService.removeLingot(id);
  }

  @ApiTags('mouvements-lingots')
  @ApiOperation({ summary: 'Créer un mouvement de lingot' })
  @ApiCreation(MouvementResponseDto)
  @Post('mouvements-lingots')
  createMouvementCollection(@Body() body: CreateMouvementCollectionDto) {
    return this.lingotsService.createMouvementCollection(body);
  }
  @ApiTags('mouvements-lingots')
  @ApiOperation({ summary: 'Lister les mouvements de lingots' })
  @ApiListe(MouvementResponseDto)
  @Get('mouvements-lingots')
  findAllMouvements() {
    return this.lingotsService.findAllMouvements();
  }
  @ApiTags('mouvements-lingots')
  @ApiOperation({ summary: 'Obtenir un mouvement par son _id MongoDB' })
  @ApiParam({ name: 'id', description: '_id MongoDB du mouvement' })
  @ApiElement(MouvementResponseDto)
  @Get('mouvements-lingots/:id')
  findMouvementById(@Param('id') id: string) {
    return this.lingotsService.findMouvementById(id);
  }
  @ApiTags('mouvements-lingots')
  @ApiOperation({ summary: 'Modifier un mouvement de lingot' })
  @ApiParam({ name: 'id', description: '_id MongoDB du mouvement' })
  @ApiElement(MouvementResponseDto)
  @Patch('mouvements-lingots/:id')
  updateMouvementById(
    @Param('id') id: string,
    @Body() body: UpdateMouvementDto,
  ) {
    return this.lingotsService.updateMouvementById(id, body);
  }
  @ApiTags('mouvements-lingots')
  @ApiOperation({ summary: 'Supprimer un mouvement de lingot' })
  @ApiParam({ name: 'id', description: '_id MongoDB du mouvement' })
  @ApiElement(MouvementResponseDto)
  @UseGuards(DestructiveOperationsGuard)
  @Delete('mouvements-lingots/:id')
  removeMouvementById(@Param('id') id: string) {
    return this.lingotsService.removeMouvementById(id);
  }

  @ApiCreation(MouvementResponseDto)
  @Post('lingots/:lingotId/mouvements')
  createMouvement(
    @Param('lingotId') lingotId: string,
    @Body() body: CreateMouvementDto,
  ) {
    return this.lingotsService.createMouvement(lingotId, body);
  }
  @ApiListe(MouvementResponseDto)
  @Get('lingots/:lingotId/mouvements')
  findMouvements(@Param('lingotId') lingotId: string) {
    return this.lingotsService.findMouvements(lingotId);
  }
  @ApiElement(MouvementResponseDto)
  @Get('lingots/:lingotId/mouvements/:mouvementId')
  findMouvement(
    @Param('lingotId') lingotId: string,
    @Param('mouvementId') mouvementId: string,
  ) {
    return this.lingotsService.findMouvement(lingotId, mouvementId);
  }
  @ApiElement(MouvementResponseDto)
  @Patch('lingots/:lingotId/mouvements/:mouvementId')
  updateMouvement(
    @Param('lingotId') lingotId: string,
    @Param('mouvementId') mouvementId: string,
    @Body() body: UpdateMouvementDto,
  ) {
    return this.lingotsService.updateMouvement(lingotId, mouvementId, body);
  }
  @ApiElement(MouvementResponseDto)
  @UseGuards(DestructiveOperationsGuard)
  @Delete('lingots/:lingotId/mouvements/:mouvementId')
  removeMouvement(
    @Param('lingotId') lingotId: string,
    @Param('mouvementId') mouvementId: string,
  ) {
    return this.lingotsService.removeMouvement(lingotId, mouvementId);
  }

  @ApiCreation(InventaireResponseDto)
  @Post('inventaires-lingots')
  createInventaire(@Body() body: CreateInventaireDto) {
    return this.lingotsService.createInventaire(body);
  }
  @ApiListe(InventaireResponseDto)
  @Get('inventaires-lingots')
  findInventaires() {
    return this.lingotsService.findInventaires();
  }
  @ApiElement(InventaireResponseDto)
  @Get('inventaires-lingots/:id')
  findInventaire(@Param('id') id: string) {
    return this.lingotsService.findInventaire(id);
  }
  @ApiElement(InventaireResponseDto)
  @Patch('inventaires-lingots/:id')
  updateInventaire(@Param('id') id: string, @Body() body: UpdateInventaireDto) {
    return this.lingotsService.updateInventaire(id, body);
  }
  @ApiElement(InventaireResponseDto)
  @UseGuards(DestructiveOperationsGuard)
  @Delete('inventaires-lingots/:id')
  removeInventaire(@Param('id') id: string) {
    return this.lingotsService.removeInventaire(id);
  }

  @ApiCreation(MatteResponseDto)
  @Post('matte-lingots')
  createMatte(@Body() body: CreateMatteDto) {
    return this.lingotsService.createMatte(body);
  }
  @ApiListe(MatteResponseDto)
  @Get('matte-lingots')
  findMattes() {
    return this.lingotsService.findMattes();
  }
  @ApiElement(MatteResponseDto)
  @Get('matte-lingots/:id')
  findMatte(@Param('id') id: string) {
    return this.lingotsService.findMatte(id);
  }
  @ApiElement(MatteResponseDto)
  @Patch('matte-lingots/:id')
  updateMatte(@Param('id') id: string, @Body() body: UpdateMatteDto) {
    return this.lingotsService.updateMatte(id, body);
  }
  @ApiElement(MatteResponseDto)
  @UseGuards(DestructiveOperationsGuard)
  @Delete('matte-lingots/:id')
  removeMatte(@Param('id') id: string) {
    return this.lingotsService.removeMatte(id);
  }

  @ApiCreation(HistoriqueStockResponseDto)
  @Post('historique-stock-lingots')
  createHistoriqueStock(@Body() body: CreateHistoriqueStockDto) {
    return this.lingotsService.createHistoriqueStock(body);
  }
  @ApiListe(HistoriqueStockResponseDto)
  @Get('historique-stock-lingots')
  findHistoriquesStock() {
    return this.lingotsService.findHistoriquesStock();
  }
  @ApiElement(HistoriqueStockResponseDto)
  @Get('historique-stock-lingots/:id')
  findHistoriqueStock(@Param('id') id: string) {
    return this.lingotsService.findHistoriqueStock(id);
  }
  @ApiElement(HistoriqueStockResponseDto)
  @Patch('historique-stock-lingots/:id')
  updateHistoriqueStock(
    @Param('id') id: string,
    @Body() body: UpdateHistoriqueStockDto,
  ) {
    return this.lingotsService.updateHistoriqueStock(id, body);
  }
  @ApiElement(HistoriqueStockResponseDto)
  @UseGuards(DestructiveOperationsGuard)
  @Delete('historique-stock-lingots/:id')
  removeHistoriqueStock(@Param('id') id: string) {
    return this.lingotsService.removeHistoriqueStock(id);
  }
}
