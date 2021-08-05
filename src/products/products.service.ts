import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { DeliveryMethodType } from 'src/delivery-method-types/entities/delivery-method-type.entity';
import { ProductFeature } from 'src/product-features/entities/product-feature.entity';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Tag } from 'src/tags/entities/tag.entity';
import { In, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
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

  async paginate({offset, perPage, filters: {
    id,
    name,
    reference,
    minPrice,
    maxPrice,
    minQuantity,
    maxQuantity,
    categoryIds,
    tagIds,
    storeId,
    storeName,
    storeCategoryIds,
  }}: ProductPaginationOptionsDto): Promise<PaginationResult<Product>> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product')
      .take(perPage)
      .skip(offset)
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .leftJoinAndSelect('product.productFeatures', 'productFeature')
      .leftJoinAndSelect('product.productFeatureGroups', 'productFeatureGroup')
      .leftJoinAndSelect('productFeatureGroup.productFeatureForGroups', 'productFeatureForGroup')
      .leftJoinAndSelect('product.deliveryMethodTypes', 'deliveryMethodType')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoin('product.tags', 'tag');

    if (id) queryBuilder.andWhere('product.id = :id', { id });

    if (name) queryBuilder.andWhere('product.name LIKE :name', { name: `%${name}%` });

    if (reference) queryBuilder.andWhere('product.reference LIKE :reference', { reference: `%${reference}%` });

    if (minPrice) queryBuilder.andWhere('product.price >= :minPrice', { minPrice });

    if (maxPrice) queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });

    if (minQuantity) queryBuilder.andWhere('product.quantity >= :minQuantity', { minQuantity });

    if (maxQuantity) queryBuilder.andWhere('product.quantity <= :maxQuantity', { maxQuantity });

    if (storeId) queryBuilder.andWhere('product.storeId = :storeId', { storeId });

    if (storeName) queryBuilder.andWhere('store.name LIKE :storeName', { storeName: `%${storeName}%` });

    if (storeCategoryIds.length > 0) queryBuilder.andWhere('store.storeCategoryId In (:...storeCategoryIds)', { storeCategoryIds });

    if (categoryIds.length > 0) queryBuilder.andWhere('category.id In (:...categoryIds)', { categoryIds });

    if (tagIds.length > 0) queryBuilder.andWhere('tag.id In (:...tagIds)', { tagIds });

    const [products, total] = await queryBuilder.getManyAndCount();

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

  async findOneById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: [
        'brand',
        'categories',
        'productImages',
        'productFeatures',
        'productFeatureGroups',
        'productFeatureGroups.productFeatureForGroups',
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

  async findOneBySlug(slug: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { slug },
      relations: [
        'brand',
        'categories',
        'productImages',
        'productFeatures',
        'productFeatureGroups',
        'productFeatureGroups.productFeatureForGroups',
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
