import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { Discount } from 'src/discounts/entities/discount.entity';
import { Product } from 'src/products/entities/product.entity';
import { StoreFeature } from 'src/store-features/entities/store-feature.entity';
import { StoreHour } from 'src/store-hours/entities/store-hour.entity';
import { StoreImages } from 'src/stores-profile/dto/store-images';
import { HashingService } from 'src/support/hashing.service';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { Brackets, In, Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { StorePaginationOptionsDto } from './dto/store-pagination-options.dto';
import { UpdateStorePasswordDto } from './dto/update-store-password.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreProfile } from './entities/store-profile.entity';
import { Store } from './entities/store.entity';
import { StoreNotFoundException } from './erros/store-not-found.exception';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(StoreFeature) private readonly storeFeaturesRepository: Repository<StoreFeature>,
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    private readonly hashingService: HashingService
  ) {}

  async paginate({offset, perPage, filters: {
    id,
    userStatusCode,
    email,
    name,
    storeCategoryIds,
    phoneNumber,
    withCheapestProduct,
    cardIssuerIds,
    cardIds,
    isFavoriteFor,
    storeFeatureIds,
    userLatLng,
    locationIds,
    withinLocationId,
    withinWktPolygon,
    minRating,
    isOpen,
    minDiscount,
  }}: StorePaginationOptionsDto, userId: number): Promise<PaginationResult<User>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.userStatus', 'userStatus')
      .innerJoinAndSelect('user.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .innerJoinAndSelect('store.storeCategory', 'storeCategory')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndMapOne(
        'store.latestActiveDiscount',
        'store.discounts',
        'latestActiveDiscount',
        'latestActiveDiscount.from <= :today AND latestActiveDiscount.until >= :today'
      , { today: new Date() })
      .leftJoinAndSelect('store.storeFeatures', 'storeFeature')
      .leftJoin('store.discounts', 'discount', 'discount.from <= :today AND discount.until >= :today', { today: new Date() })
      .leftJoin('discount.cardIssuers', 'cardIssuerFromDiscount')
      .leftJoin('discount.cards', 'card', '')
      .leftJoin('card.cardIssuer', 'cardIssuerFromCard')
      .leftJoin('store.deliveryMethods', 'deliveryMethod')
      .leftJoin('deliveryMethod.deliveryZones', 'deliveryZone')
      .leftJoin('deliveryZone.locations', 'location')
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('store.id = :id', { id });

    if (userStatusCode) queryBuilder.andWhere('user.userStatusCode = :userStatusCode', { userStatusCode });

    if (email) queryBuilder.andWhere('user.email LIKE :email', {email: `%${email}%`});

    if (name) queryBuilder.andWhere('store.name LIKE :name', {name: `%${name}%`});

    if (storeCategoryIds.length > 0) queryBuilder.andWhere('store.storeCategoryId In (:...storeCategoryIds)', { storeCategoryIds });

    if (phoneNumber) queryBuilder.andWhere('store.phoneNumber LIKE :phoneNumber', {phoneNumber: `%${phoneNumber}%`});

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
      queryBuilder.innerJoin('store.storeToUsers', 'storeToUser', 'storeToUser.userId = :isFavoriteFor', { isFavoriteFor });
    }

    if (storeFeatureIds.length > 0) queryBuilder.andWhere('storeFeature.id In (:...storeFeatureIds)', { storeFeatureIds });

    if (userLatLng.length >= 2) {
      queryBuilder.andWhere(`ST_CONTAINS(location.area, POINT(:latitude, :longitude))`, {
        latitude: userLatLng[0],
        longitude: userLatLng[1],
      });
    }

    if (locationIds.length > 0) {
      queryBuilder.where('location.id IN (:...locationIds)', { locationIds });
    }

    if (withinLocationId) {
      queryBuilder.andWhere('ST_CONTAINS((SELECT locations.area FROM locations WHERE locations.id = :withinLocationId AND locations.deleted_at IS NULL LIMIT 1), store.location)', { withinLocationId });
    }

    if (withinWktPolygon) {
      queryBuilder.andWhere('ST_WITHIN(store.location, ST_GEOMFROMTEXT(:withinWktPolygon))', { withinWktPolygon: `POLYGON((${withinWktPolygon}))` });
    }

    if (minRating) {
      queryBuilder.andWhere(`store.rating >= :minRating`, { minRating });
    }

    if (isOpen !== null && isOpen) {
      const now = new Date();
      const dayOfTheWeek = format(now, 'iiii').toUpperCase();
      const time = format(now, 'HH:mm:ss');

      queryBuilder.andWhere(qb => {
        const subQuery = qb.subQuery()
          .select([
            'subStoreHour.id',
          ])
          .from(StoreHour, 'subStoreHour')
          .where('subStoreHour.storeId = store.id')
          .andWhere('subStoreHour.isWorkingDay = 1')
          .andWhere('subStoreHour.day = :day')
          .andWhere('subStoreHour.startTime <= :time AND subStoreHour.endTime >= :time')
          .getQuery();

        return `EXISTS(${subQuery})`;
      })
      .setParameters({
        day: dayOfTheWeek,
        time,
      });
    }

    if (minDiscount) {
      queryBuilder.andWhere(qb => {
        const subQuery = qb.subQuery()
          .select(['1'])
          .from(Discount, 'subDiscount')
          .where('subDiscount.storeId = store.id')
          .andWhere('subDiscount.value >= :minDiscount', { minDiscount })
          .andWhere('subDiscount.from <= :minDiscountToday AND subDiscount.until >= :minDiscountToday', { minDiscountToday: new Date() })
          .getQuery();

        return `EXISTS(${subQuery})`;
      })
      .setParameters({
        minDiscount,
        minDiscountToday: new Date(),
      })
    }

    queryBuilder.leftJoinAndMapOne(
      'store.storeToUser',
      'store.storeToUsers',
      'storeToUserAlone',
      'storeToUserAlone.userId = :userId',
      { userId }
    );

    const [stores, total] = await queryBuilder.getManyAndCount();

    if (withCheapestProduct && stores.length > 0) {
      const products = await this.productsRepository.createQueryBuilder('product')
        .addSelect('product.storeId')
        .leftJoinAndSelect('product.productDetails', 'productDetail')
        .where('product.storeId IN(:...storeIds)', { storeIds: stores.map(store => store.store.id) })
        .orderBy('productDetail.price', 'ASC')
        .getMany();

      for (const store of stores) {
        store.store.cheapestProduct = products.find(product => product.storeId === store.store.id) ?? null;
      }
    }

    return new PaginationResult(stores, total, perPage);
  }

  // @TODO - ESTO ESTA ROTO
  async create(
    {
      email,
      password,
      userStatusCode,
      name,
      phoneNumber,
      address,
      latitude,
      longitude,
      storeCategoryId,
      ...createStoreProfileData
    }: CreateStoreDto,
    images: StoreImages
  ): Promise<User> {
    const user = User.create({
      email,
      password: await this.hashingService.make(password),
      userStatusCode,
      role: Role.STORE,
    });

    user.store = Store.create({
      name,
      phoneNumber,
      address,
      latitude,
      longitude,
      location: `POINT(${latitude} ${longitude})`,
      storeCategoryId,
      storeProfile: StoreProfile.create(createStoreProfileData)
      // @TODO - Agregar horarios
    });

    if (images.banner) {
      user.store.storeProfile.banner = images.banner;
    }

    if (images.logo) {
      user.store.storeProfile.logo = images.logo;
    }

    if (images.frontImage) {
      user.store.storeProfile.frontImage = images.frontImage;
    }

    return await this.usersRepository.save(user);
  }

  async findOneById(id: number, userId: number = 0): Promise<User> {
    const user = await this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.userStatus', 'userStatus')
      .leftJoinAndSelect('user.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.storeCategory', 'storeCategory')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndMapOne(
        'store.latestActiveDiscount',
        'store.discounts',
        'latestActiveDiscount',
        'latestActiveDiscount.from <= :today AND latestActiveDiscount.until >= :today'
      , { today: new Date() })
      .leftJoinAndMapOne(
        'store.storeToUser',
        'store.storeToUsers',
        'storeToUserAlone',
        'storeToUserAlone.userId = :userId',
        { userId }
      )
      .leftJoinAndSelect('store.storeFeatures', 'storeFeature')
      .where('store.id = :id', { id })
      .getOne();

    if (!user) {
      throw new StoreNotFoundException();
    }

    return user;
  }

  async findOneBySlug(slug: string, userId: number): Promise<User> {
    const user = await this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.userStatus', 'userStatus')
      .leftJoinAndSelect('user.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('store.storeCategory', 'storeCategory')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndMapOne(
        'store.latestActiveDiscount',
        'store.discounts',
        'latestActiveDiscount',
        'latestActiveDiscount.from <= :today AND latestActiveDiscount.until >= :today'
      , { today: new Date() })
      .leftJoinAndMapOne(
        'store.storeToUser',
        'store.storeToUsers',
        'storeToUserAlone',
        'storeToUserAlone.userId = :userId',
        { userId }
      )
      .leftJoinAndSelect('store.storeFeatures', 'storeFeature')
      .where('store.slug = :slug', { slug })
      .getOne();

    if (!user) {
      throw new StoreNotFoundException();
    }

    return user;
  }

  async update(
    {
      id,
      email,
      userStatusCode,
      name,
      phoneNumber,
      address,
      latitude,
      longitude,
      storeFeatureIds,
      ...updateStoreProfileData
    }: UpdateStoreDto,
    images: StoreImages
  ): Promise<User> {
    const user = await this.findOneById(+id);

    Object.assign(user, {email, userStatusCode});

    Object.assign(user.store, {
      name,
      phoneNumber,
      address,
      latitude,
      longitude,
      location: `POINT(${latitude} ${longitude})`,
    });

    if (!user.store.storeProfile) {
      user.store.storeProfile = new StoreProfile();
    }

    Object.assign(user.store.storeProfile, updateStoreProfileData);

    if (images.banner) {
      user.store.storeProfile.banner = images.banner;
    }

    if (images.logo) {
      user.store.storeProfile.logo = images.logo;
    }

    if (images.frontImage) {
      user.store.storeProfile.frontImage = images.frontImage;
    }

    user.store.storeFeatures = await this.storeFeaturesRepository.find({
      where: { id: In(storeFeatureIds) },
    });

    return await this.usersRepository.save(user);
  }

  async updatePassword({id, ...updateStorePasswordDto}: UpdateStorePasswordDto): Promise<User> {
    const user = await this.findOneById(+id);

    user.password = await this.hashingService.make(updateStorePasswordDto.password);

    return await this.usersRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.findOneById(id);

    await this.usersRepository.softRemove(user);
  }
}
