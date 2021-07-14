import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreImages } from 'src/stores-profile/dto/store-images';
import { HashingService } from 'src/support/hashing.service';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { StorePaginationOptionsDto } from './dto/store-pagination-options.dto';
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

  async paginate({offset, perPage, filters}: StorePaginationOptionsDto): Promise<PaginationResult<User>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.store', 'store')
      .innerJoinAndSelect('store.storeProfile', 'storeProfile')
      .innerJoinAndSelect('store.storeCategory', 'storeCategory')
      .take(perPage)
      .skip(offset);

    if (filters.id) queryBuilder.andWhere('user.id = :id', {id: filters.id});

    if (filters.email) queryBuilder.andWhere('user.email LIKE :email', {email: `%${filters.email}%`});

    if (filters.name) queryBuilder.andWhere('store.name LIKE :name', {name: `%${filters.name}%`});

    if (filters.storeCategoryId) queryBuilder.andWhere('store.storeCategoryId = :storeCategoryId', {storeCategoryId: filters.storeCategoryId});

    if (filters.phoneNumber) queryBuilder.andWhere('store.phoneNumber LIKE :phoneNumber', {phoneNumber: `%${filters.phoneNumber}%`});

    // @TODO: Add status filter

    const [stores, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(stores, total, perPage);
  }

  async create(
    {
      email,
      password,
      isActive,
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
      isActive,
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

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {id, role: Role.STORE},
      relations: ['store', 'store.storeProfile', 'store.storeCategory'],
    });

    if (!user) {
      throw new StoreNotFoundException();
    }

    return user;
  }

  async update(
    {
      id,
      email,
      isActive,
      name,
      phoneNumber,
      address,
      latitude,
      longitude,
      ...updateStoreProfileData
    }: UpdateStoreDto,
    images: StoreImages
  ): Promise<User> {
    const user = await this.findOne(+id);

    Object.assign(user, {email, isActive});

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

  async delete(id: number): Promise<void> {
    const user = await this.findOne(id);

    await this.usersRepository.softRemove(user);
  }
}
