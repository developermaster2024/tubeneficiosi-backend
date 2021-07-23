import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/support/hashing.service';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { Repository } from 'typeorm';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PasswordDoesNotMatchException } from './exceptions/password-does-not-match.exception';
import { ProfileNotFoundException } from './exceptions/profile-not-found.exception';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService
  ) {}

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

  async update({userId, name, phoneNumber, img}: UpdateProfileDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {id: userId, role: Role.CLIENT},
      relations: ['client']
    });

    user.client.name = name;
    user.client.phoneNumber = phoneNumber;

    if (img) {
      user.client.imgPath = img.path;
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
