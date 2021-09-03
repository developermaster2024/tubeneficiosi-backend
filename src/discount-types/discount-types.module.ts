import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountTypesController } from './discount-types.controller';
import { DiscountTypesService } from './discount-types.service';
import { DiscountType } from './entities/discount-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountType])],
  controllers: [DiscountTypesController],
  providers: [DiscountTypesService]
})
export class DiscountTypesModule {}
