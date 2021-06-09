import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileNotFoundException } from 'src/stores-profile/errors/profile-not-found.exception';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {id, role: Role.CLIENT},
      relations: ['client']
    });

    if (!user) {
      throw new ProfileNotFoundException();
    }

    return user;
  }

  async update({userId, name, phoneNumber, ...updateProfileDto}: UpdateProfileDto, img: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {id: userId, role: Role.CLIENT},
      relations: ['client']
    });

    Object.assign(user, updateProfileDto);

    user.client.name = name;
    user.client.phoneNumber = phoneNumber;
    user.client.imgPath = img;

    return await this.usersRepository.save(user);
  }
}
