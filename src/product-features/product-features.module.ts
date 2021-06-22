import { Module } from '@nestjs/common';
import { ProductFeaturesService } from './product-features.service';
import { ProductFeaturesController } from './product-features.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFeature } from './entities/product-feature.entity';
import { Store } from 'src/stores/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductFeature, Store])],
  providers: [ProductFeaturesService],
  controllers: [ProductFeaturesController]
})
export class ProductFeaturesModule {}
