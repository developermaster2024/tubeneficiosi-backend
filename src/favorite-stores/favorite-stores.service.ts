import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToggleFavoriteStoreDto } from './dto/toggle-favorite-store.dto';
import { StoreToUser } from './entities/store-to-user.entity';

@Injectable()
export class FavoriteStoresService {
  constructor(@InjectRepository(StoreToUser) private readonly storeToUserRepository: Repository<StoreToUser>) {}

  async toggle({ userId, storeId }: ToggleFavoriteStoreDto): Promise<boolean> {
    const storeToUser = await this.storeToUserRepository.createQueryBuilder('storeToUser')
      .where('storeToUser.storeId = :storeId', { storeId })
      .andWhere('storeToUser.userId = :userId', { userId })
      .getOne();

    let isFavorite: boolean;

    if (storeToUser) {
      await this.storeToUserRepository.delete(storeToUser);
      isFavorite = false;
    } else {
      await this.storeToUserRepository.save(StoreToUser.create({ userId, storeId }));
      isFavorite = true;
    }

    return isFavorite;
  }
}
