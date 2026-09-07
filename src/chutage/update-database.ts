import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ChutageModule } from './chutage.module.js';
import { ChutageService } from './chutage.service.js';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nestjs-global-api'),
    ChutageModule,
  ],
})
class UpdateChutageDatabaseModule {}

const application = await NestFactory.createApplicationContext(UpdateChutageDatabaseModule);
await application.get(ChutageService).updateDatabase();
await application.close();
console.log('Les collections Chutage ont ete mises a jour.');