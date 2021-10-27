import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { DeliveryMethodType } from 'src/delivery-method-types/entities/delivery-method-type.entity';
import { ProductFeature } from 'src/product-features/entities/product-feature.entity';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { Brackets, FindConditions, In, Repository } from 'typeorm';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { DeleteProductImageDto } from './dto/delete-product-image.dto';
import { ProductPaginationOptionsDto } from './dto/product-pagination-options.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDetails } from './entities/product-details.entity';
import { ProductDimension } from './entities/product-dimension.entity';
import { ProductFeatureForGroup } from './entities/product-feature-for-group.entity';
import { ProductFeatureGroup } from './entities/product-feature-group.entity';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';
import { ProductImageNotFound } from './errors/product-image-not-found.exception';
import { ProductNotFoundException } from './errors/product-not-found.exception';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
    @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Store) private readonly storesRepository: Repository<Store>,
    @InjectRepository(ProductFeature) private readonly productFeaturesRepository: Repository<ProductFeature>,
    @InjectRepository(ProductFeatureGroup) private readonly productFeatureForGroupsRepository: Repository<ProductFeatureGroup>,
    @InjectRepository(ProductImage) private readonly productImagesRepository: Repository<ProductImage>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>
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
    categoryName,
    tagIds,
    storeId,
    storeName,
    storeCategoryIds,
    cardIssuerIds,
    cardIds,
    isFavoriteFor,
    minRating,
    storeFeatureIds,
  }, tagsToSortBy}: ProductPaginationOptionsDto, userId: number): Promise<PaginationResult<Product>> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product')
      .take(perPage)
      .skip(offset)
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .leftJoinAndSelect('product.productDetails', 'productDetails')
      .leftJoinAndSelect('productDetails.brand', 'brand')
      .leftJoinAndSelect('product.productFeatures', 'productFeature')
      .leftJoinAndSelect('product.productFeatureGroups', 'productFeatureGroup')
      .leftJoinAndSelect('productFeatureGroup.productFeatureForGroups', 'productFeatureForGroup')
      .leftJoinAndSelect('product.deliveryMethodTypes', 'deliveryMethodType')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndMapOne(
        'store.latestActiveDiscount',
        'store.discounts',
        'latestActiveDiscount',
        'latestActiveDiscount.from <= :today AND latestActiveDiscount.until >= :today'
      , { today: new Date() })
      .leftJoinAndSelect('store.storeFeatures', 'storeFeature')
      .leftJoin('product.tags', 'tag')
      .leftJoin('store.discounts', 'discount', 'discount.from <= :today AND discount.until >= :today', { today: new Date() })
      .leftJoin('discount.cardIssuers', 'cardIssuerFromDiscount')
      .leftJoin('discount.cards', 'card')
      .leftJoin('card.cardIssuer', 'cardIssuerFromCard');

    if (tagsToSortBy.length > 0) {
      queryBuilder.addSelect(`
          (SELECT COUNT(*)
          FROM product_to_tag
          WHERE
            product_to_tag.product_id = product.id AND
            product_to_tag.tag_id IN(:...tagIds))
        `, 'tags_count')
        .setParameter('tagIds', tagsToSortBy)
        .orderBy('tags_count', 'DESC');
    }

    if (id) queryBuilder.andWhere('product.id = :id', { id });

    if (name) queryBuilder.andWhere('product.name LIKE :name', { name: `%${name}%` });

    if (reference) queryBuilder.andWhere('productDetails.reference LIKE :reference', { reference: `%${reference}%` });

    if (minPrice) queryBuilder.andWhere('productDetails.price >= :minPrice', { minPrice });

    if (maxPrice) queryBuilder.andWhere('productDetails.price <= :maxPrice', { maxPrice });

    if (minQuantity) queryBuilder.andWhere('productDetails.quantity >= :minQuantity', { minQuantity });

    if (maxQuantity) queryBuilder.andWhere('productDetails.quantity <= :maxQuantity', { maxQuantity });

    if (storeId) queryBuilder.andWhere('product.storeId = :storeId', { storeId });

    if (storeName) queryBuilder.andWhere('store.name LIKE :storeName', { storeName: `%${storeName}%` });

    if (storeCategoryIds.length > 0) queryBuilder.andWhere('store.storeCategoryId In (:...storeCategoryIds)', { storeCategoryIds });

    if (categoryIds.length > 0) queryBuilder.andWhere('category.id In (:...categoryIds)', { categoryIds });

    if (categoryName) queryBuilder.andWhere('category.name LIKE :categoryName', { categoryName: `%${categoryName}%` });

    if (tagIds.length > 0) queryBuilder.andWhere('tag.id In (:...tagIds)', { tagIds });

    if (cardIssuerIds.length > 0) {
      queryBuilder.andWhere(new Brackets(qb => {
        qb
          .andWhere('cardIssuerFromDiscount.id In (:...cardIssuerIds)', { cardIssuerIds })
          .orWhere('cardIssuerFromCard.id IN (:...cardIssuerIds)', { cardIssuerIds });
      }));
    }

    if (cardIds.length > 0) {
      queryBuilder.andWhere('card.id In (:...cardIds)', { cardIds });
    }

    if (isFavoriteFor) {
      queryBuilder.innerJoin('product.favoriteProducts', 'favoriteProduct', 'favoriteProduct.userId = :isFavoriteFor', { isFavoriteFor });
    }

    if (storeFeatureIds.length > 0) queryBuilder.andWhere('storeFeature.id IN (:...storeFeatureIds)', { storeFeatureIds });

    queryBuilder.leftJoinAndMapOne(
      'product.favoriteProduct',
      'product.favoriteProducts',
      'favoriteProductAlone',
      'favoriteProductAlone.userId = :userId',
      { userId }
    );

    if (minRating) {
      queryBuilder.andWhere(`product.rating >= :minRating`, { minRating });
    }

    const [products, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(products, total, perPage);
  }

  async create({
    userId,
    tagIds,
    categoryIds,
    features,
    featureGroups,
    deliveryMethodTypeCodes,
    brandId,
    reference,
    shortDescription,
    quantity,
    price,
    ...createProductDto
  }: CreateProductDto, images: Express.Multer.File[]): Promise<Product> {
    const store = await this.findUserStore(userId);

    const tags = tagIds ? await this.tagsRepository.find({id: In(tagIds)}) : [];
    const categories = categoryIds ? await this.categoriesRepository.find({id: In(categoryIds), store}) : [];
    const productFeatures = features ? features.map(feature => ProductFeature.create(feature)) : [];
    const productFeatureGroups = featureGroups ? featureGroups.map(({name, isMultiSelectable, features}) => ProductFeatureGroup.create({
      name,
      isMultiSelectable,
      productFeatureForGroups: features.map(feature => ProductFeatureForGroup.create(feature)),
    })) : [];

    const productDetails = ProductDetails.create({
      brandId: brandId ? brandId : null,
      reference,
      shortDescription,
      quantity,
      price,
    });

    const product = Product.create({
      ...createProductDto,
      tags,
      categories,
      productImages: images.map((imageFile, i) => ProductImage.create({
        path: imageFile.path,
        isPortrait: i === 0,
        position: i,
      })),
      store,
      productDetails,
      productFeatures,
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
    const product = await this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .leftJoinAndSelect('product.productDetails', 'productDetails')
      .leftJoinAndSelect('productDetails.brand', 'brand')
      .leftJoinAndSelect('product.productFeatures', 'productFeature')
      .leftJoinAndSelect('product.productFeatureGroups', 'productFeatureGroup')
      .leftJoinAndSelect('productFeatureGroup.productFeatureForGroups', 'productFeatureForGroup')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndMapOne(
        'store.latestActiveDiscount',
        'store.discounts',
        'latestActiveDiscount',
        'latestActiveDiscount.from <= :today AND latestActiveDiscount.until >= :today'
      , { today: new Date() })
      .leftJoinAndSelect('product.deliveryMethodTypes', 'deliveryMethodType')
      .leftJoinAndSelect('product.productDimensions', 'productDimension')
      .where('product.id = :id', { id })
      .getOne();

    if (!product) {
      throw new ProductNotFoundException();
    }

    return product;
  }

  async findOneBySlug(slug: string, userId: number): Promise<Product> {
    const product = await this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .leftJoinAndSelect('product.productDetails', 'productDetails')
      .leftJoinAndSelect('productDetails.brand', 'brand')
      .leftJoinAndSelect('product.productFeatures', 'productFeature')
      .leftJoinAndSelect('product.productFeatureGroups', 'productFeatureGroup')
      .leftJoinAndSelect('productFeatureGroup.productFeatureForGroups', 'productFeatureForGroup')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndMapOne(
        'store.latestActiveDiscount',
        'store.discounts',
        'latestActiveDiscount',
        'latestActiveDiscount.from <= :today AND latestActiveDiscount.until >= :today'
      , { today: new Date() })
      .leftJoinAndSelect('product.deliveryMethodTypes', 'deliveryMethodType')
      .leftJoinAndSelect('product.tags', 'tag')
      .leftJoinAndMapOne(
        'product.favoriteProduct',
        'product.favoriteProducts',
        'favoriteProductAlone',
        'favoriteProductAlone.userId = :userId',
        { userId }
      )
      .where('product.slug = :slug', { slug })
      .getOne();

    if (!product) {
      throw new ProductNotFoundException();
    }

    return product;
  }

  async update({
    id,
    userId,
    tagIds,
    categoryIds,
    features,
    featureGroups,
    deliveryMethodTypeCodes,
    brandId,
    width,
    height,
    length,
    weight,
    reference,
    shortDescription,
    quantity,
    price,
    ...updateProductDto
  }: UpdateProductDto): Promise<Product> {
    const store = await this.findUserStore(userId);

    const product = await this.productsRepository.findOne({
      id,
      store,
    });

    if (!product) {
      throw new ProductNotFoundException();
    }

    await this.productFeaturesRepository
      .createQueryBuilder('productFeature')
      .delete()
      .from(ProductFeature)
      .where('productId = :productId', {productId: product.id})
      .execute();

    await this.productFeatureForGroupsRepository
      .createQueryBuilder('productFeatureGroup')
      .delete()
      .from(ProductFeatureGroup)
      .where('productId = :productId', {productId: product.id})
      .execute();

    const tags = tagIds ? await this.tagsRepository.find({id: In(tagIds)}) : [];
    const categories = categoryIds ? await this.categoriesRepository.find({id: In(categoryIds), store}) : [];
    const productFeatures = features ? features.map(feature => ProductFeature.create(feature)) : [];
    const productFeatureGroups = featureGroups ? featureGroups.map(({name, isMultiSelectable, features}) => ProductFeatureGroup.create({
      name,
      isMultiSelectable,
      productFeatureForGroups: features.map(feature => ProductFeatureForGroup.create(feature)),
    })) : [];

    const productDetails = ProductDetails.create({
      brandId: brandId ? brandId : null,
      reference,
      shortDescription,
      quantity,
      price,
    });

    const updatedData: Record<string, any> = {
      ...updateProductDto,
      tags,
      categories,
      productDetails,
      productFeatures,
      productFeatureGroups,
      productDimensions: ProductDimension.create({
        width,
        height,
        length,
        weight,
      }),
      deliveryMethodTypes: deliveryMethodTypeCodes.map(typeCode => DeliveryMethodType.create({code: typeCode})),
    };

    Object.assign(product, updatedData);

    return await this.productsRepository.save(product);
  }

  async delete(id: number, userId: number): Promise<void> {
    const user = await this.usersRepository.findOne(userId);

    const where: FindConditions<Product> = {};

    if (user.role !== Role.ADMIN) {
      where.store = await this.findUserStore(userId);
    }

    const product = await this.productsRepository.findOne({
      id,
      ...where,
    })

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

  async createProductImage({ userId, productId, image, ...createProductImageDto}: CreateProductImageDto): Promise<ProductImage> {
    const store = await this.findUserStore(userId);

    const product = await this.productsRepository.findOne({
      id: productId,
      store,
    });

    if (!product) {
      throw new ProductNotFoundException();
    }

    await this.productImagesRepository.delete({
      product,
      position: createProductImageDto.position,
    });

    const productImage = ProductImage.create({
      ...createProductImageDto,
      isPortrait: createProductImageDto.position == 0,
      path: image.path,
      product,
    });

    return await this.productImagesRepository.save(productImage);
  }

  async deleteProductImage({userId, productId, position}: DeleteProductImageDto): Promise<void> {
    const productImage = await this.productImagesRepository.createQueryBuilder('productImage')
      .leftJoin('productImage.product', 'product')
      .leftJoin('product.store', 'store')
      .leftJoin('store.user', 'user')
      .where('productImage.position = :position', { position })
      .andWhere('product.id = :productId', { productId })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    if (!productImage) {
      throw new ProductImageNotFound();
    }

    await this.productImagesRepository.remove(productImage);
  }
}
