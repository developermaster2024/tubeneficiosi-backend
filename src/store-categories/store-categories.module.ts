import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreCategory } from './entities/store-category.entity';
import { StoreCategoriesController } from './store-categories.controller';
import { StoreCategoriesService } from './store-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreCategory])],
  controllers: [StoreCategoriesController],
  providers: [StoreCategoriesService]
})
export class StoreCategoriesModule {}
