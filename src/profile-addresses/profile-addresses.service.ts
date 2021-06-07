import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/support/pagination/pagination-options';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreateProfileAddressDto } from './dto/create-profile-address.dto';
import { UpdateProfileAddressDto } from './dto/update-profile-address.dto';
import { ProfileAddress } from './entities/profile-address.entity';
import { ProfileAddressNotFoundException } from './exceptions/profile-address-not-found.exception';

@Injectable()
export class ProfileAddressesService {
  constructor(@InjectRepository(ProfileAddress) private readonly profileAddressesRepository: Repository<ProfileAddress>) {}

  async paginate(options: PaginationOptions, userId: number): Promise<PaginationResult<ProfileAddress>> {
    const [profileAddresses, total] = await this.profileAddressesRepository.findAndCount({
      take: options.perPage,
      skip: options.offset,
      where: {user: userId},
    });

    return new PaginationResult(profileAddresses, total, options.perPage);
  }

  async create(createProfileAddressDto: CreateProfileAddressDto): Promise<ProfileAddress> {
    const profileAddress = Object.assign(new ProfileAddress(), createProfileAddressDto);

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
