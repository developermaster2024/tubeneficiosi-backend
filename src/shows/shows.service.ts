import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Place } from 'src/places/entities/place.entity';
import { PlaceNotFoundException } from 'src/places/errors/place-not-found.exception';
import { ProductImage } from 'src/products/entities/product-image.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductNotFoundException } from 'src/products/errors/product-not-found.exception';
import { StoreCategoriesWithSchedules } from 'src/store-categories/enum/store-category.enum';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Tag } from 'src/tags/entities/tag.entity';
import { In, Repository } from 'typeorm';
import { AddShowDto } from './dto/add-show.dto';
import { CreateProductShowDto } from './dto/create-product-show.dto';
import { DeleteProductShowDto } from './dto/delete-product-show.dto';
import { DeleteShowDto } from './dto/delete-show.dto';
import { ShowPaginationOptionsDto } from './dto/show-pagination-options.dto';
import { UpdateProductShowDto } from './dto/update-product-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { ShowDetails } from './entities/show-details.entity';
import { ShowToZone } from './entities/show-to-zone.entity';
import { Show } from './entities/show.entity';
import { ShowNotFoundException } from './errors/show-not-found.exception';

const DEFAULT_SHOW_TO_ZONE_PRICE = 0;

@Injectable()
export class ShowsService {
  constructor(
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(Store) private readonly storesRepository: Repository<Store>,
    @InjectRepository(Show) private readonly showsRepository: Repository<Show>,
    @InjectRepository(Place) private readonly placesRepository: Repository<Place>,
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
    @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>
  ) {}

  async create({userId, trailer, tagIds, categoryIds, ...createShowDto}: CreateProductShowDto, images: Express.Multer.File[]): Promise<Product> {
    const store = await this.storesRepository.createQueryBuilder('store')
      .leftJoin('store.storeCategory', 'storeCategory')
      .where('store.userId = :userId', { userId })
      .andWhere('storeCategory.name IN(:...storeCategoryNames)', { storeCategoryNames: StoreCategoriesWithSchedules })
      .getOne();

    if (!store) throw new StoreNotFoundException();

    const tags = tagIds ? await this.tagsRepository.find({id: In(tagIds)}) : [];
    const categories = categoryIds ? await this.categoriesRepository.find({id: In(categoryIds), store}) : [];

    const product = Product.create({
      ...createShowDto,
      store,
      showDetails: ShowDetails.create({ trailer }),
      productImages: images.map((imageFile, i) => ProductImage.create({
        path: imageFile.path,
        isPortrait: i === 0,
        position: i,
      })),
      tags,
      categories,
    });

    return await this.productsRepository.save(product);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.tags', 'tag')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .leftJoinAndSelect('product.showDetails', 'showDetails')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoinAndSelect('product.shows', 'show')
      .leftJoinAndSelect('show.showToZones', 'showToZone')
      .leftJoinAndSelect('showToZone.zone', 'zone')
      .leftJoinAndSelect('show.place', 'place')
      .leftJoin('store.storeCategory', 'storeCategory')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndMapOne(
        'store.latestActiveDiscount',
        'store.discounts',
        'latestActiveDiscount',
        'latestActiveDiscount.from <= :today AND latestActiveDiscount.until >= :today'
      , { today: new Date() })
      .where('product.id = :id', { id })
      .andWhere('storeCategory.name IN(:...storeCategoryNames)', { storeCategoryNames: StoreCategoriesWithSchedules })
      .getOne();

    if (!product) throw new ProductNotFoundException();

    return product;
  }

  async update({id, userId, trailer, tagIds, categoryIds, ...updateShowDto}: UpdateProductShowDto): Promise<Product> {
    const product = await this.productsRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.showDetails', 'showDetails')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoin('store.storeCategory', 'storeCategory')
      .where('product.id = :id', { id })
      .andWhere('store.userId = :userId', { userId })
      .andWhere('storeCategory.name IN(:...storeCategoryNames)', { storeCategoryNames: StoreCategoriesWithSchedules })
      .getOne();

    if (!product) throw new ProductNotFoundException();

    const tags = tagIds ? await this.tagsRepository.find({id: In(tagIds)}) : [];
    const categories = categoryIds ? await this.categoriesRepository.createQueryBuilder('category')
      .innerJoin('category.store', 'store')
      .where('category.id IN(:...categoryIds)', { categoryIds })
      .andWhere('store.userId = :userId', { userId })
      .getOne() : [];

    Object.assign(product, {
      ...updateShowDto,
      tags,
      categories,
    });

    product.showDetails.trailer = trailer;

    return await this.productsRepository.save(product);
  }

  async delete({id, userId}: DeleteProductShowDto): Promise<void> {
    const product = await this.productsRepository.createQueryBuilder('product')
      .innerJoin('product.store', 'store')
      .where('product.id = :id', { id })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!product) throw new ProductNotFoundException();

    await this.productsRepository.softRemove(product);
  }

  async paginateShows({perPage, offset, filters: {
    id,
    date,
    productId,
    isActive,
  }}: ShowPaginationOptionsDto): Promise<PaginationResult<Show>> {
    const queryBuilder = this.showsRepository.createQueryBuilder('show')
      .take(perPage)
      .skip(offset)
      .leftJoinAndSelect('show.showToZones', 'showToZone')
      .leftJoinAndSelect('showToZone.zone', 'zone')
      .leftJoinAndSelect('show.place', 'place');

    if (id) queryBuilder.andWhere('show.id = :id', { id });

    if (productId) queryBuilder.andWhere('show.productId = :productId', { productId });

    if (isActive !== null) {
      const condition = isActive
        ? 'show.date >= :today'
        : 'show.date < :today';

      queryBuilder.andWhere(condition, { today: new Date() });
    }

    if (date) queryBuilder.andWhere('DATE_FORMAT(show.date, "%Y-%m-%d") = :date', { date });

    const [shows, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(shows, total, perPage);
  }

  async addShow({productId, userId, placeId, ...addShowDto}: AddShowDto): Promise<Show> {
    const product = await this.productsRepository.createQueryBuilder('product')
      .innerJoin('product.store', 'store')
      .innerJoin('store.storeCategory', 'storeCategory')
      .where('product.id = :id', { id: productId })
      .andWhere('store.userId = :userId', { userId })
      .andWhere('storeCategory.name IN(:...storeCategoryNames)', { storeCategoryNames: StoreCategoriesWithSchedules })
      .getOne();

    if (!product) throw new ProductNotFoundException();

    const place = await this.placesRepository.createQueryBuilder('place')
      .innerJoinAndSelect('place.zones', 'zone')
      .innerJoin('place.store', 'store')
      .where('place.id = :placeId', { placeId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!place) throw new PlaceNotFoundException();

    const show = Show.create({
      ...addShowDto,
      place,
      product,
      showToZones: place.zones.map(zone => ShowToZone.create({
        price: DEFAULT_SHOW_TO_ZONE_PRICE,
        availableSeats: zone.capacity,
        zone,
      }))
    });

    return await this.showsRepository.save(show);
  }

  async updateShow({showId, productId, userId, showToZones, ...updateShowDto}: UpdateShowDto): Promise<Show> {
    const show = await this.showsRepository.createQueryBuilder('show')
      .innerJoin('show.product', 'product')
      .innerJoin('product.store', 'store')
      .innerJoinAndSelect('show.showToZones', 'showToZone')
      .where('show.id = :showId', { showId })
      .andWhere('product.id = :productId', { productId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!show) throw new ShowNotFoundException();

    Object.assign(show, updateShowDto);

    show.showToZones = show.showToZones.map(showToZone => {
      const foundShowToZone = showToZones.find(stz => stz.id === showToZone.id);

      return {
        ...showToZone,
        price: foundShowToZone?.price ?? showToZone.price,
        availableSeats: foundShowToZone?.availableSeats ?? showToZone.availableSeats,
      }
    });

    return await this.showsRepository.save(show);
  }

  async deleteShow({productId, userId, showId}: DeleteShowDto): Promise<Product> {
    const show = await this.showsRepository.createQueryBuilder('show')
      .innerJoin('show.product', 'product')
      .innerJoin('product.store', 'store')
      .where('show.id = :showId', { showId })
      .andWhere('product.id = :productId', { productId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!show) throw new ShowNotFoundException();

    await this.showsRepository.remove(show);

    const product = await this.findOne(productId);

    return product;
  }
}
