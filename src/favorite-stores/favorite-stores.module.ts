import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreToUser } from './entities/store-to-user.entity';
import { FavoriteStoresController } from './favorite-stores.controller';
import { FavoriteStoresService } from './favorite-stores.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreToUser])],
  controllers: [FavoriteStoresController],
  providers: [FavoriteStoresService]
})
export class FavoriteStoresModule {}
