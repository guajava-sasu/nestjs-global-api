import type { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { OpenApiResponseInterceptor } from './common/openapi-response.interceptor.js';
import { createOpenApiDocument } from './openapi.js';

export function setupSwagger(app: INestApplication) {
  const document = createOpenApiDocument(app);
  app.useGlobalInterceptors(new OpenApiResponseInterceptor(document));
  SwaggerModule.setup('docs', app, document);
  SwaggerModule.setup('api', app, document);
}
