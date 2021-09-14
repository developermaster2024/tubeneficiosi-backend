import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToggleFavoriteProductDto } from './dto/toggle-favorite-product.dto';
import { FavoriteProduct } from './entities/favorite-product.entity';

@Injectable()
export class FavoriteProductsService {
  constructor(@InjectRepository(FavoriteProduct) private readonly favoriteProducts: Repository<FavoriteProduct>) {}

  async toggle({userId, productId}: ToggleFavoriteProductDto): Promise<boolean> {
    const favoriteProduct = await this.favoriteProducts.createQueryBuilder('favoriteProduct')
      .where('favoriteProduct.userId = :userId', { userId })
      .andWhere('favoriteProduct.productId = :productId', { productId })
      .getOne();

    let isFavorite: boolean;

    if (favoriteProduct) {
      await this.favoriteProducts.remove(favoriteProduct);
      isFavorite = false;
    } else {
      await this.favoriteProducts.save(FavoriteProduct.create({ userId, productId }))
      isFavorite = true;
    }

    return isFavorite;
  }
}
