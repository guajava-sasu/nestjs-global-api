import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateFournisseurDto,
  CreateInventaireDto,
  CreateLingotDto,
  CreateMatteDto,
  CreateMouvementDto,
  CreateOperateurDto,
  CreatePositionDto,
  CreateTauxAluminiumDto,
  UpdateFournisseurDto,
  UpdateInventaireDto,
  UpdateLingotDto,
  UpdateMatteDto,
  UpdateMouvementDto,
  UpdateOperateurDto,
  UpdatePositionDto,
  UpdateTauxAluminiumDto,
} from './dto/lingot.dto.js';
import { LingotsService } from './lingots.service.js';

@ApiTags('lingots')
@Controller()
export class LingotsController {
  constructor(private readonly lingotsService: LingotsService) {}

  @Post('operateurs-lingots')
  createOperateur(@Body() body: CreateOperateurDto) {
    return this.lingotsService.createOperateur(body);
  }
  @Get('operateurs-lingots')
  findOperateurs() {
    return this.lingotsService.findOperateurs();
  }
  @Get('operateurs-lingots/:id')
  findOperateur(@Param('id') id: string) {
    return this.lingotsService.findOperateur(id);
  }
  @Patch('operateurs-lingots/:id')
  updateOperateur(@Param('id') id: string, @Body() body: UpdateOperateurDto) {
    return this.lingotsService.updateOperateur(id, body);
  }
  @Delete('operateurs-lingots/:id')
  removeOperateur(@Param('id') id: string) {
    return this.lingotsService.removeOperateur(id);
  }

  @Post('fournisseurs-lingots')
  createFournisseur(@Body() body: CreateFournisseurDto) {
    return this.lingotsService.createFournisseur(body);
  }
  @Get('fournisseurs-lingots')
  findFournisseurs() {
    return this.lingotsService.findFournisseurs();
  }
  @Get('fournisseurs-lingots/:id')
  findFournisseur(@Param('id') id: string) {
    return this.lingotsService.findFournisseur(id);
  }
  @Patch('fournisseurs-lingots/:id')
  updateFournisseur(
    @Param('id') id: string,
    @Body() body: UpdateFournisseurDto,
  ) {
    return this.lingotsService.updateFournisseur(id, body);
  }
  @Delete('fournisseurs-lingots/:id')
  removeFournisseur(@Param('id') id: string) {
    return this.lingotsService.removeFournisseur(id);
  }

  @Post('taux-aluminium-lingots')
  createTauxAluminium(@Body() body: CreateTauxAluminiumDto) {
    return this.lingotsService.createTauxAluminium(body);
  }
  @Get('taux-aluminium-lingots')
  findTauxAluminium() {
    return this.lingotsService.findTauxAluminium();
  }
  @Get('taux-aluminium-lingots/:id')
  findTauxAluminiumById(@Param('id') id: string) {
    return this.lingotsService.findTauxAluminiumById(id);
  }
  @Patch('taux-aluminium-lingots/:id')
  updateTauxAluminium(
    @Param('id') id: string,
    @Body() body: UpdateTauxAluminiumDto,
  ) {
    return this.lingotsService.updateTauxAluminium(id, body);
  }
  @Delete('taux-aluminium-lingots/:id')
  removeTauxAluminium(@Param('id') id: string) {
    return this.lingotsService.removeTauxAluminium(id);
  }

  @Post('positions-lingots')
  createPosition(@Body() body: CreatePositionDto) {
    return this.lingotsService.createPosition(body);
  }
  @Get('positions-lingots')
  findPositions() {
    return this.lingotsService.findPositions();
  }
  @Get('positions-lingots/:id')
  findPosition(@Param('id') id: string) {
    return this.lingotsService.findPosition(id);
  }
  @Patch('positions-lingots/:id')
  updatePosition(@Param('id') id: string, @Body() body: UpdatePositionDto) {
    return this.lingotsService.updatePosition(id, body);
  }
  @Delete('positions-lingots/:id')
  removePosition(@Param('id') id: string) {
    return this.lingotsService.removePosition(id);
  }

  @Post('lingots')
  createLingot(@Body() body: CreateLingotDto) {
    return this.lingotsService.createLingot(body);
  }
  @Get('lingots')
  findLingots() {
    return this.lingotsService.findLingots();
  }
  @Get('lingots/:id')
  findLingot(@Param('id') id: string) {
    return this.lingotsService.findLingot(id);
  }
  @Patch('lingots/:id')
  updateLingot(@Param('id') id: string, @Body() body: UpdateLingotDto) {
    return this.lingotsService.updateLingot(id, body);
  }
  @Delete('lingots/:id')
  removeLingot(@Param('id') id: string) {
    return this.lingotsService.removeLingot(id);
  }

  @Post('lingots/:lingotId/mouvements')
  createMouvement(
    @Param('lingotId') lingotId: string,
    @Body() body: CreateMouvementDto,
  ) {
    return this.lingotsService.createMouvement(lingotId, body);
  }
  @Get('lingots/:lingotId/mouvements')
  findMouvements(@Param('lingotId') lingotId: string) {
    return this.lingotsService.findMouvements(lingotId);
  }
  @Get('lingots/:lingotId/mouvements/:mouvementId')
  findMouvement(
    @Param('lingotId') lingotId: string,
    @Param('mouvementId') mouvementId: string,
  ) {
    return this.lingotsService.findMouvement(lingotId, mouvementId);
  }
  @Patch('lingots/:lingotId/mouvements/:mouvementId')
  updateMouvement(
    @Param('lingotId') lingotId: string,
    @Param('mouvementId') mouvementId: string,
    @Body() body: UpdateMouvementDto,
  ) {
    return this.lingotsService.updateMouvement(lingotId, mouvementId, body);
  }
  @Delete('lingots/:lingotId/mouvements/:mouvementId')
  removeMouvement(
    @Param('lingotId') lingotId: string,
    @Param('mouvementId') mouvementId: string,
  ) {
    return this.lingotsService.removeMouvement(lingotId, mouvementId);
  }

  @Post('inventaires-lingots')
  createInventaire(@Body() body: CreateInventaireDto) {
    return this.lingotsService.createInventaire(body);
  }
  @Get('inventaires-lingots')
  findInventaires() {
    return this.lingotsService.findInventaires();
  }
  @Get('inventaires-lingots/:id')
  findInventaire(@Param('id') id: string) {
    return this.lingotsService.findInventaire(id);
  }
  @Patch('inventaires-lingots/:id')
  updateInventaire(
    @Param('id') id: string,
    @Body() body: UpdateInventaireDto,
  ) {
    return this.lingotsService.updateInventaire(id, body);
  }
  @Delete('inventaires-lingots/:id')
  removeInventaire(@Param('id') id: string) {
    return this.lingotsService.removeInventaire(id);
  }

  @Post('matte-lingots')
  createMatte(@Body() body: CreateMatteDto) {
    return this.lingotsService.createMatte(body);
  }
  @Get('matte-lingots')
  findMattes() {
    return this.lingotsService.findMattes();
  }
  @Get('matte-lingots/:id')
  findMatte(@Param('id') id: string) {
    return this.lingotsService.findMatte(id);
  }
  @Patch('matte-lingots/:id')
  updateMatte(@Param('id') id: string, @Body() body: UpdateMatteDto) {
    return this.lingotsService.updateMatte(id, body);
  }
  @Delete('matte-lingots/:id')
  removeMatte(@Param('id') id: string) {
    return this.lingotsService.removeMatte(id);
  }
}