import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async update({userId, ...updateProfileDto}: UpdateProfileDto, img: string): Promise<User> {
    const user = await this.usersRepository.findOne(userId);

    Object.assign(user, {
      ...updateProfileDto,
      imgPath: img,
    });

    return await this.usersRepository.save(user);
  }
}
