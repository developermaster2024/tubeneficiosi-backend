import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Category } from 'src/categories/entities/category.entity';
import { ProductFeature } from 'src/product-features/entities/product-feature.entity';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Tag } from 'src/tags/entities/tag.entity';
import { FindConditions, In, Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductPaginationOptionsDto } from './dto/product-pagination-options.dto';
import { ProductFeatureForGroup } from './entities/product-feature-for-group.entity';
import { ProductFeatureGroup } from './entities/product-feature-group.entity';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';
import { ProductToProductFeature } from './entities/prouct-to-product-feature.entity';
import { ProductNotFoundException } from './errors/product-not-found.exception';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
    @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Store) private readonly storesRepository: Repository<Store>,
    @InjectRepository(ProductFeature) private readonly productFeaturesRepository: Repository<ProductFeature>
  ) {}

  async paginate({offset, perPage, filters}: ProductPaginationOptionsDto): Promise<PaginationResult<Product>> {
    const where: FindConditions<Product> = {};

    // @ts-ignore
    if (filters.id) where.id = +filters.id;

    if (filters.name) where.name = Like(`%${filters.name}%`);

    // @TODO: agregar el resto de filtros, cuadrar con Jeyver

    const [products, total] = await this.productsRepository.findAndCount({
      take: perPage,
      skip: offset,
    });

    return new PaginationResult(products, total, perPage);
  }

  async create({userId, tagIds, categoryIds, features, featureGroups, ...createProductDto}: CreateProductDto, images: Express.Multer.File[]): Promise<Product> {
    const store = await this.findUserStore(userId);

    const tags = await this.tagsRepository.find({id: In(tagIds)});
    const categories = await this.categoriesRepository.find({id: In(categoryIds), store});
    const productFeatures = await this.productFeaturesRepository.find({id: In(features.map(feature => feature.id))});
    const productToProductFeatures = productFeatures.map((productFeature) => ProductToProductFeature.create({
      productFeature,
      price: features.find(feature => feature.id == productFeature.id)?.price ?? 0,
    }));
    const productFeatureGroups = featureGroups.map(({name, isMultiSelectable, features}) => ProductFeatureGroup.create({
      name,
      isMultiSelectable,
      productFeatureForGroups: features.map(feature => ProductFeatureForGroup.create(feature)),
    }));

    const product = Product.create({
      ...createProductDto,
      tags,
      categories,
      productImages: images.map(imageFile => ProductImage.create({path: imageFile.path})),
      productToProductFeatures,
      store,
      productFeatureGroups
    });

    return await this.productsRepository.save(product);
  }

  async findOneBySlug(slug: string): Promise<Product> {
    const product = await this.productsRepository.findOne({slug});

    if (!product) {
      throw new ProductNotFoundException();
    }

    return product;
  }

  async delete(id: number, userId: number): Promise<void> {
    const store = await this.findUserStore(userId);
    const product = await this.productsRepository.findOne({id, store})

    if (!product) {
      throw new ProductNotFoundException();
    }

    await this.productsRepository.softRemove(product);
  }

  async findUserStore(userId: number): Promise<Store> {
    const store = await this.storesRepository.findOne({user: {id: userId}});

    if (!store) {
      throw new StoreNotFoundException();
    }

    return store;
  }
}
