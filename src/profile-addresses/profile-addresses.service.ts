import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreateProfileAddressDto } from './dto/create-profile-address.dto';
import { ProfileAddressPaginationOptionsDto } from './dto/profile-address-pagination-options.dto';
import { UpdateProfileAddressDto } from './dto/update-profile-address.dto';
import { ProfileAddress } from './entities/profile-address.entity';
import { ProfileAddressNotFoundException } from './exceptions/profile-address-not-found.exception';

@Injectable()
export class ProfileAddressesService {
  constructor(@InjectRepository(ProfileAddress) private readonly profileAddressesRepository: Repository<ProfileAddress>) {}

  async paginate({perPage, offset, filters: {
    id,
    name,
  }}: ProfileAddressPaginationOptionsDto, userId: number): Promise<PaginationResult<ProfileAddress>> {
    const queryBuilder = this.profileAddressesRepository.createQueryBuilder('profileAddress')
      .take(perPage)
      .skip(offset)
      .where('profileAddress.userId = :userId', { userId });

    if (id) queryBuilder.andWhere('profileAddress.id = :id', { id });

    if (name) queryBuilder.andWhere('profileAddress.name LIKE :name', { name: `%${name}%` });

    const [profileAddresses, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(profileAddresses, total, perPage);
  }

  async create({user, ...createProfileAddressDto}: CreateProfileAddressDto): Promise<ProfileAddress> {
    const profileAddress = Object.assign(new ProfileAddress(), {...createProfileAddressDto, userId: user});

    return await this.profileAddressesRepository.save(profileAddress);
  }

  async findOne(id: number, userId: number): Promise<ProfileAddress> {
    const profileAddress = await this.profileAddressesRepository.findOne({
      id,
      user: {id: userId},
    });

    if (!profileAddress) {
      throw new ProfileAddressNotFoundException();
    }

    return profileAddress;
  }

  async update({id, user, ...updateProfileAddressDto}: UpdateProfileAddressDto): Promise<ProfileAddress> {
    const profileAddress = await this.profileAddressesRepository.findOne({
      id, user: {id: user}
    });

    if (!profileAddress) {
      throw new ProfileAddressNotFoundException();
    }

    Object.assign(profileAddress, updateProfileAddressDto);

    return await this.profileAddressesRepository.save(profileAddress);
  }

  async delete(id: number, userId: number): Promise<void> {
    const profileAddress = await this.profileAddressesRepository.findOne({
      id, user: {id: userId}
    });

    if (!profileAddress) {
      throw new ProfileAddressNotFoundException();
    }

    await this.profileAddressesRepository.softRemove(profileAddress);
  }
}
