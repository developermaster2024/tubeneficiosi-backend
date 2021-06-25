import { Module } from '@nestjs/common';
import { AdsPositionsService } from './ads-positions.service';
import { AdsPositionsController } from './ads-positions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdsPosition } from './entities/ads-position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdsPosition])],
  providers: [AdsPositionsService],
  controllers: [AdsPositionsController]
})
export class AdsPositionsModule {}
