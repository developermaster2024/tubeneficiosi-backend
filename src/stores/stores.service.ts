import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreImages } from 'src/stores-profile/dto/store-images';
import { HashingService } from 'src/support/hashing.service';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { Brackets, Repository } from 'typeorm';
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
  }}: StorePaginationOptionsDto, userId: number): Promise<PaginationResult<User>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.userStatus', 'userStatus')
      .innerJoinAndSelect('user.store', 'store')
      .innerJoinAndSelect('store.storeProfile', 'storeProfile')
      .innerJoinAndSelect('store.storeCategory', 'storeCategory')
      .leftJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndMapOne(
        'store.latestActiveDiscount',
        'store.discounts',
        'latestActiveDiscount',
        'latestActiveDiscount.from <= :today AND latestActiveDiscount.until >= :today'
      , { today: new Date() })
      .leftJoin('store.discounts', 'discount', 'discount.from <= :today AND discount.until >= :today', { today: new Date() })
      .leftJoin('discount.cardIssuers', 'cardIssuerFromDiscount')
      .leftJoin('discount.cards', 'card', '')
      .leftJoin('card.cardIssuer', 'cardIssuerFromCard')
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('store.id = :id', { id });

    if (userStatusCode) queryBuilder.andWhere('user.userStatusCode = :userStatusCode', { userStatusCode });

    if (email) queryBuilder.andWhere('user.email LIKE :email', {email: `%${email}%`});

    if (name) queryBuilder.andWhere('store.name LIKE :name', {name: `%${name}%`});

    if (storeCategoryIds.length > 0) queryBuilder.andWhere('store.storeCategoryId In (:...storeCategoryIds)', { storeCategoryIds });

    if (phoneNumber) queryBuilder.andWhere('store.phoneNumber LIKE :phoneNumber', {phoneNumber: `%${phoneNumber}%`});

    if (withCheapestProduct) {
      queryBuilder.leftJoinAndMapOne(
        'store.cheapestProduct',
        'store.products',
        'product',
        'product.price = (SELECT MIN(product2.price) FROM products AS product2 WHERE product2.store_id = store.id AND product2.deleted_at IS NULL)'
      );
    }

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

    queryBuilder.leftJoinAndMapOne(
      'store.storeToUser',
      'store.storeToUsers',
      'storeToUserAlone',
      'storeToUserAlone.userId = :userId',
      { userId }
    );

    const [stores, total] = await queryBuilder.getManyAndCount();

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

  async findOneById(id: number): Promise<User> {
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
