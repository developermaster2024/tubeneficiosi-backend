import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardIssuerTypesController } from './card-issuer-types.controller';
import { CardIssuerTypesService } from './card-issuer-types.service';
import { CardIssuerType } from './entities/card-issuer-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardIssuerType])],
  controllers: [CardIssuerTypesController],
  providers: [CardIssuerTypesService]
})
export class CardIssuerTypesModule {}
