import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { HashingService } from 'src/support/hashing.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = plainToClass(User, createUserDto);
    user.password = await this.hashingService.make(createUserDto.password);

    return await this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({email});

    return user;
  }
}
