import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ApiOperation, ApiOkResponse, ApiProduces, ApiServiceUnavailableResponse, ApiTags,
} from '@nestjs/swagger';
import type { Connection } from 'mongoose';
import { AppService } from './app.service.js';
import { HealthResponseDto, UnavailableResponseDto } from './common/dto/http-response.dto.js';
import { LINGOTS_CONNECTION_NAME } from './lingots/lingots.constants.js';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly mainConnection: Connection,
    @InjectConnection(LINGOTS_CONNECTION_NAME)
    private readonly lingotsConnection: Connection,
  ) {}

  @Get()
  @ApiOperation({ summary: "Vérifier que l'API répond" })
  @ApiProduces('text/html')
  @ApiOkResponse({ description: 'Message de bienvenue', type: String })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Vérifier la disponibilité HTTP' })
  @ApiOkResponse({ type: HealthResponseDto, description: 'API disponible' })
  getHealth() {
    return { status: 'ok' };
  }

  @Get('health/ready')
  @ApiOperation({ summary: 'Vérifier les connexions indispensables' })
  @ApiOkResponse({ type: HealthResponseDto, description: 'API et bases MongoDB disponibles' })
  @ApiServiceUnavailableResponse({ type: UnavailableResponseDto, description: 'Une connexion MongoDB est indisponible' })
  getReadiness() {
    if (
      this.mainConnection.readyState !== 1 ||
      this.lingotsConnection.readyState !== 1
    ) {
      throw new ServiceUnavailableException({ status: 'unavailable' });
    }
    return { status: 'ok' };
  }
}
