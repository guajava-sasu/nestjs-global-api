import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateBilanLingotsJourDto,
  CreateEtatStockJournalierDto,
  CreateLigneReceptionLingotDto,
  CreateLingotStockDto,
  CreateLivraisonFournisseurDto,
  CreateMouvementLingotDto,
  CreateReceptionLingotDto,
  UpdateBilanLingotsJourDto,
  UpdateEtatStockJournalierDto,
  UpdateLigneReceptionLingotDto,
  UpdateLingotStockDto,
  UpdateLivraisonFournisseurDto,
  UpdateMouvementLingotDto,
  UpdateReceptionLingotDto,
} from './dto/lingots.dto.js';
import { LingotsService } from './lingots.service.js';

@ApiTags('lingots')
@Controller()
export class LingotsController {
  constructor(private readonly lingotsService: LingotsService) {}

  @Post('lingots')
  @ApiOperation({ summary: 'Créer un lingot en stock' })
  @ApiCreatedResponse({ description: 'Lingot créé' })
  createLingot(@Body() body: CreateLingotStockDto) {
    return this.lingotsService.createLingot(body);
  }
  @Get('lingots')
  @ApiOperation({ summary: 'Lister les lingots en stock' })
  @ApiOkResponse({ description: 'Liste des lingots' })
  findLingots() {
    return this.lingotsService.findLingots();
  }
  @Get('lingots/:id')
  @ApiParam({ name: 'id', description: 'Identifiant métier du lingot' })
  @ApiNotFoundResponse({ description: 'Lingot introuvable' })
  findLingot(@Param('id') id: string) {
    return this.lingotsService.findLingot(id);
  }
  @Patch('lingots/:id')
  @ApiParam({ name: 'id', description: 'Identifiant métier du lingot' })
  updateLingot(@Param('id') id: string, @Body() body: UpdateLingotStockDto) {
    return this.lingotsService.updateLingot(id, body);
  }
  @Delete('lingots/:id')
  @ApiParam({ name: 'id', description: 'Identifiant métier du lingot' })
  removeLingot(@Param('id') id: string) {
    return this.lingotsService.removeLingot(id);
  }

  @Post('livraisons-fournisseurs')
  createLivraison(@Body() body: CreateLivraisonFournisseurDto) {
    return this.lingotsService.createLivraison(body);
  }
  @Get('livraisons-fournisseurs')
  findLivraisons() {
    return this.lingotsService.findLivraisons();
  }
  @Get('livraisons-fournisseurs/:id')
  findLivraison(@Param('id') id: string) {
    return this.lingotsService.findLivraison(id);
  }
  @Patch('livraisons-fournisseurs/:id')
  updateLivraison(
    @Param('id') id: string,
    @Body() body: UpdateLivraisonFournisseurDto,
  ) {
    return this.lingotsService.updateLivraison(id, body);
  }
  @Delete('livraisons-fournisseurs/:id')
  removeLivraison(@Param('id') id: string) {
    return this.lingotsService.removeLivraison(id);
  }

  @Post('lignes-reception-lingots')
  createLigneReception(@Body() body: CreateLigneReceptionLingotDto) {
    return this.lingotsService.createLigneReception(body);
  }
  @Get('lignes-reception-lingots')
  findLignesReception() {
    return this.lingotsService.findLignesReception();
  }
  @Get('lignes-reception-lingots/:id')
  findLigneReception(@Param('id') id: string) {
    return this.lingotsService.findLigneReception(id);
  }
  @Patch('lignes-reception-lingots/:id')
  updateLigneReception(
    @Param('id') id: string,
    @Body() body: UpdateLigneReceptionLingotDto,
  ) {
    return this.lingotsService.updateLigneReception(id, body);
  }
  @Delete('lignes-reception-lingots/:id')
  removeLigneReception(@Param('id') id: string) {
    return this.lingotsService.removeLigneReception(id);
  }

  @Post('receptions-lingots')
  @ApiOperation({ summary: 'Créer une réception de lingots' })
  @ApiCreatedResponse({ description: 'Réception créée' })
  createReception(@Body() body: CreateReceptionLingotDto) {
    return this.lingotsService.createReception(body);
  }
  @Get('receptions-lingots')
  @ApiOperation({ summary: 'Lister les réceptions de lingots' })
  @ApiOkResponse({ description: 'Liste des réceptions de lingots' })
  findReceptions() {
    return this.lingotsService.findReceptions();
  }
  @Get('receptions-lingots/:id')
  @ApiParam({ name: 'id', description: 'Identifiant de la réception' })
  findReception(@Param('id') id: string) {
    return this.lingotsService.findReception(id);
  }
  @Patch('receptions-lingots/:id')
  @ApiParam({ name: 'id', description: 'Identifiant de la réception' })
  updateReception(
    @Param('id') id: string,
    @Body() body: UpdateReceptionLingotDto,
  ) {
    return this.lingotsService.updateReception(id, body);
  }
  @Delete('receptions-lingots/:id')
  @ApiParam({ name: 'id', description: 'Identifiant de la réception' })
  removeReception(@Param('id') id: string) {
    return this.lingotsService.removeReception(id);
  }

  @Post('etats-stock-journaliers')
  createEtatStock(@Body() body: CreateEtatStockJournalierDto) {
    return this.lingotsService.createEtatStock(body);
  }
  @Get('etats-stock-journaliers')
  findEtatsStock() {
    return this.lingotsService.findEtatsStock();
  }
  @Get('etats-stock-journaliers/:id')
  findEtatStock(@Param('id') id: string) {
    return this.lingotsService.findEtatStock(id);
  }
  @Patch('etats-stock-journaliers/:id')
  updateEtatStock(
    @Param('id') id: string,
    @Body() body: UpdateEtatStockJournalierDto,
  ) {
    return this.lingotsService.updateEtatStock(id, body);
  }
  @Delete('etats-stock-journaliers/:id')
  removeEtatStock(@Param('id') id: string) {
    return this.lingotsService.removeEtatStock(id);
  }

  @Post('mouvements-lingots')
  createMouvement(@Body() body: CreateMouvementLingotDto) {
    return this.lingotsService.createMouvement(body);
  }
  @Get('mouvements-lingots')
  findMouvements() {
    return this.lingotsService.findMouvements();
  }
  @Get('mouvements-lingots/:id')
  findMouvement(@Param('id') id: string) {
    return this.lingotsService.findMouvement(id);
  }
  @Patch('mouvements-lingots/:id')
  updateMouvement(
    @Param('id') id: string,
    @Body() body: UpdateMouvementLingotDto,
  ) {
    return this.lingotsService.updateMouvement(id, body);
  }
  @Delete('mouvements-lingots/:id')
  removeMouvement(@Param('id') id: string) {
    return this.lingotsService.removeMouvement(id);
  }

  @Post('bilans-lingots-jours')
  createBilan(@Body() body: CreateBilanLingotsJourDto) {
    return this.lingotsService.createBilan(body);
  }
  @Get('bilans-lingots-jours')
  findBilans() {
    return this.lingotsService.findBilans();
  }
  @Get('bilans-lingots-jours/:id')
  findBilan(@Param('id') id: string) {
    return this.lingotsService.findBilan(id);
  }
  @Patch('bilans-lingots-jours/:id')
  updateBilan(
    @Param('id') id: string,
    @Body() body: UpdateBilanLingotsJourDto,
  ) {
    return this.lingotsService.updateBilan(id, body);
  }
  @Delete('bilans-lingots-jours/:id')
  removeBilan(@Param('id') id: string) {
    return this.lingotsService.removeBilan(id);
  }
}
