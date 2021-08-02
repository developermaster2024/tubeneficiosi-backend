import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Category } from 'src/categories/entities/category.entity';
import { DeliveryMethodType } from 'src/delivery-method-types/entities/delivery-method-type.entity';
import { ProductFeature } from 'src/product-features/entities/product-feature.entity';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Tag } from 'src/tags/entities/tag.entity';
import { FindConditions, In, Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductPaginationOptionsDto } from './dto/product-pagination-options.dto';
import { ProductDimension } from './entities/product-dimension.entity';
import { ProductFeatureForGroup } from './entities/product-feature-for-group.entity';
import { ProductFeatureGroup } from './entities/product-feature-group.entity';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';
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

    if (filters.storeId) where.storeId = filters.storeId;

    // @TODO: agregar el resto de filtros, cuadrar con Jeyver

    const [products, total] = await this.productsRepository.findAndCount({
      take: perPage,
      skip: offset,
      join: {
        alias: 'product',
        leftJoinAndSelect: {
          brand: 'product.brand',
          category: 'product.categories',
          productImage: 'product.productImages',
          deliveryMethodType: 'product.deliveryMethodTypes',
          store: 'product.store',
          storeProfile: 'store.storeProfile',
        },
      },
      where,
    });

    return new PaginationResult(products, total, perPage);
  }

  async create({userId, tagIds, categoryIds, features, featureGroups, deliveryMethodTypeCodes, brandId, ...createProductDto}: CreateProductDto, images: Express.Multer.File[]): Promise<Product> {
    const store = await this.findUserStore(userId);

    const tags = tagIds ? await this.tagsRepository.find({id: In(tagIds)}) : [];
    const categories = categoryIds ? await this.categoriesRepository.find({id: In(categoryIds), store}) : [];
    const productFeatures = features ? features.map(feature => ProductFeature.create(feature)) : [];
    const productFeatureGroups = featureGroups ? featureGroups.map(({name, isMultiSelectable, features}) => ProductFeatureGroup.create({
      name,
      isMultiSelectable,
      productFeatureForGroups: features.map(feature => ProductFeatureForGroup.create(feature)),
    })) : [];

    const product = Product.create({
      ...createProductDto,
      brandId: brandId ? brandId : null,
      tags,
      categories,
      productImages: images.map((imageFile, i) => ProductImage.create({
        path: imageFile.path,
        isPortrait: i === 0,
      })),
      productFeatures,
      store,
      productFeatureGroups,
      productDimensions: ProductDimension.create({
        width: createProductDto.width,
        height: createProductDto.height,
        length: createProductDto.length,
        weight: createProductDto.weight,
      }),
      deliveryMethodTypes: deliveryMethodTypeCodes.map(typeCode => DeliveryMethodType.create({code: typeCode})),
    });

    return await this.productsRepository.save(product);
  }

  async findOneBySlug(slug: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { slug },
      relations: [
        'brand',
        'categories',
        'productImages',
        'productFeatures',
        'productFeatureGroups',
        'store',
        'store.storeProfile',
        'deliveryMethodTypes',
      ],
    });

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
