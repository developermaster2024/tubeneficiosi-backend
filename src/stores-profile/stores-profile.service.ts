import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePasswordDto } from 'src/profile/dto/update-password.dto';
import { PasswordDoesNotMatchException } from 'src/profile/exceptions/password-does-not-match.exception';
import { StoreProfile } from 'src/stores/entities/store-profile.entity';
import { HashingService } from 'src/support/hashing.service';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { Repository } from 'typeorm';
import { StoreImages } from './dto/store-images';
import { UpdateStoreProfileDto } from './dto/update-store-profile.dto';
import { StoreProfileNotFoundException } from './errors/store-profile-not-found.exception';

@Injectable()
export class StoresProfileService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService
  ) {}

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {id, role: Role.STORE},
      relations: ['store']
    });

    if (!user) {
      throw new StoreProfileNotFoundException();
    }

    return user;
  }

  async update({
    userId,
    email,
    name,
    phoneNumber,
    address,
    latitude,
    longitude,
    ...updateStoreProfile
  }: UpdateStoreProfileDto, images: StoreImages): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {id: userId},
      relations: ['store'],
    });

    user.email = email;

    user.store.name = name;
    user.store.phoneNumber = phoneNumber;
    user.store.address = address;
    user.store.latitude = latitude;
    user.store.longitude = longitude;

    if (!user.store.storeProfile) {
      user.store.storeProfile = new StoreProfile();
    }

    Object.assign(user.store.storeProfile, updateStoreProfile);

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

  async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<User> {
    const user = await this.findOne(updatePasswordDto.userId);

    const passwordMatches = await this.hashingService.check(updatePasswordDto.currentPassword, user.password);

    if (! passwordMatches) {
      throw new PasswordDoesNotMatchException();
    }

    user.password = await this.hashingService.make(updatePasswordDto.password);

    return await this.usersRepository.save(user);
  }
}
