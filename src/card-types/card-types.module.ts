import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardTypesController } from './card-types.controller';
import { CardTypesService } from './card-types.service';
import { CardType } from './entities/card-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardType])],
  controllers: [CardTypesController],
  providers: [CardTypesService]
})
export class CardTypesModule {}
