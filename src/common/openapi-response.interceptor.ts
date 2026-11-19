import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import type { OpenAPIObject, ReferenceObject, SchemaObject } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { map } from 'rxjs';

export function operationId(controller: string, method: string) {
  return `${controller.replace(/Controller$/, '')}_${method}`;
}

export class OpenApiResponseInterceptor implements NestInterceptor {
  private readonly responses = new Map<string, SchemaObject | ReferenceObject>();

  constructor(private readonly document: OpenAPIObject) {
    for (const path of Object.values(document.paths)) {
      for (const operation of Object.values(path)) {
        if (!operation || typeof operation !== 'object' || !('responses' in operation)) continue;
        const { operationId: id, responses } = operation;
        const response = responses['200'] ?? responses['201'];
        if (!id || !response || '$ref' in response) continue;
        const schema = response.content?.['application/json']?.schema;
        if (schema) this.responses.set(id, schema);
      }
    }
  }

  intercept(context: ExecutionContext, next: CallHandler<unknown>) {
    const schema = this.responses.get(operationId(context.getClass().name, context.getHandler().name));
    return schema ? next.handle().pipe(map(value => this.project(value, schema))) : next.handle();
  }

  private project(value: unknown, schema: SchemaObject | ReferenceObject): unknown {
    if (value === null || typeof value !== 'object') return value;
    if ('$ref' in schema) {
      const referenced = this.document.components?.schemas?.[schema.$ref.replace('#/components/schemas/', '')];
      if (!referenced) throw new Error(`Schéma de réponse introuvable : ${schema.$ref}`);
      return this.project(value, referenced);
    }
    if (value instanceof Date || value instanceof mongoose.Types.ObjectId) return value.toJSON();
    if (Array.isArray(value)) {
      const items = schema.items;
      return items ? value.map(item => this.project(item, items)) : value;
    }
    const source: object = value instanceof mongoose.Document ? value.toJSON() : value;
    if (schema.allOf) {
      return Object.assign(
        {},
        ...schema.allOf.map(part => this.project(source, part)),
      );
    }
    if (!schema.properties) {
      // Les valeurs JSON libres sont autorisées seulement si le DTO les déclare.
      if (schema.additionalProperties === true || schema.oneOf || Object.keys(schema).length === 0) return source;
      return {};
    }
    return Object.fromEntries(
      Object.entries(schema.properties).flatMap(([key, property]) => {
        const field = Object.getOwnPropertyDescriptor(source, key);
        return field && 'value' in field ? [[key, this.project(field.value, property)]] : [];
      }),
    );
  }
}
