import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { FindConditions, Like, Repository } from 'typeorm';
import { CreateProductFeatureDto } from './dto/create-product-feature.dto';
import { ProductFeaturePaginationOptionsDto } from './dto/product-feature-pagination-options.dto';
import { UpdateProductFeatureDto } from './dto/update-product-feature.dto';
import { ProductFeature } from './entities/product-feature.entity';
import { ProductFeatureNotFoundException } from './errors/product-feature-not-found.exception';

@Injectable()
export class ProductFeaturesService {
  constructor(
    @InjectRepository(ProductFeature) private readonly productFeaturesRepository: Repository<ProductFeature>,
    @InjectRepository(Store) private readonly storesRepository: Repository<Store>,
  ) {}

  async paginate({offset, perPage, filters}: ProductFeaturePaginationOptionsDto, userId: number): Promise<PaginationResult<ProductFeature>> {
    const store = await this.findUserStore(userId);

    const where: FindConditions<ProductFeature> = {store};

    // @ts-ignore
    if (filters.id) where.id = +filters.id;

    if (filters.name) where.name = Like(`%${filters.name}%`);

    const [productFeatures, total] = await this.productFeaturesRepository.findAndCount({
      take: perPage,
      skip: offset,
      where
    });

    return new PaginationResult(productFeatures, total, perPage);
  }

  async create({userId, ...createProductFeatureDto}: CreateProductFeatureDto): Promise<ProductFeature> {
    const store = await this.findUserStore(userId);
    const productFeature = ProductFeature.create({...createProductFeatureDto, store});

    return await this.productFeaturesRepository.save(productFeature);
  }

  async findUserStore(userId: number): Promise<Store> {
    const store = await this.storesRepository.findOne({user: {id: userId}});

    if (!store) {
      throw new StoreNotFoundException();
    }

    return store;
  }

  async findOne(id: number, userId: number): Promise<ProductFeature> {
    const store = await this.findUserStore(userId);
    const productFeature = await this.productFeaturesRepository.findOne({id, store});

    if (!productFeature) {
      throw new ProductFeatureNotFoundException();
    }

    return productFeature;
  }

  async update({userId, id, ...updateProductFeatureDto}: UpdateProductFeatureDto): Promise<ProductFeature> {
    const productFeature = await this.findOne(+id, userId);

    Object.assign(productFeature, updateProductFeatureDto);

    return await this.productFeaturesRepository.save(productFeature);
  }

  async delete(id: number, userId: number): Promise<void> {
    const productFeature = await this.findOne(id, userId);

    await this.productFeaturesRepository.softRemove(productFeature);
  }
}
