import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MongoDocumentResponseDto {
  @ApiProperty({ description: '_id MongoDB', example: '6aec5826d7c5208303dc51d8' })
  _id: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  createdAt?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  updatedAt?: string;
}

export class HealthResponseDto {
  @ApiProperty({ enum: ['ok'] })
  status: 'ok';
}

export class UnavailableResponseDto {
  @ApiProperty({ enum: ['unavailable'] })
  status: 'unavailable';
}

export class HttpErrorResponseDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  error?: string;
}

export class BadRequestResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] })
  message: string | string[];

  @ApiPropertyOptional()
  error?: string;
}
