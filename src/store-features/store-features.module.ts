import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreFeature } from './entities/store-feature.entity';
import { StoreFeaturesController } from './store-features.controller';
import { StoreFeaturesService } from './store-features.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreFeature])],
  controllers: [StoreFeaturesController],
  providers: [StoreFeaturesService]
})
export class StoreFeaturesModule {}
