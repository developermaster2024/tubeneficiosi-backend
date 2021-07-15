import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { HashingService } from 'src/support/hashing.service';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { FindConditions, Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPaginationOptionsDto } from './dto/user-pagination-options.dto';
import { Admin } from './entities/admin.entity';
import { User } from './entities/user.entity';
import { Role } from './enums/roles.enum';
import { UserStatuses } from './enums/user-statuses.enum';
import { UserNotFoundException } from './errors/user-not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async paginate({offset, perPage, filters}: UserPaginationOptionsDto): Promise<PaginationResult<User>> {
    const where: FindConditions<User> = {
      role: Role.ADMIN
    };

    // @ts-ignore
    if (filters.id) where.id = +filters.id;

    if (filters.userStatusCode) where.userStatusCode = filters.userStatusCode;

    if (filters.email) where.email = Like(`%${filters.email}%`);

    if (filters.name) where.admin = {name: Like(`%${filters.name}%`)};

    // @TODO: Add status filter

    const [users, total] = await this.usersRepository.findAndCount({
      take: perPage,
      skip: offset,
      where,
      relations: ['admin']
    });

    return new PaginationResult(users, total, perPage);
  }

  async create({name, password, ...createUserDto}: CreateUserDto): Promise<User> {
    const user = User.create({
      ...createUserDto,
      role: Role.ADMIN,
      password: await this.hashingService.make(password),
      userStatusCode: UserStatuses.ACTIVE,
    });

    user.admin = Admin.create({name});

    return await this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({email});

    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      relations: ['admin'],
      where: {id, role: Role.ADMIN}
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async update({id, email, image, ...adminData}: UpdateUserDto): Promise<User> {
    const user = await this.findOne(+id);

    Object.assign(user, {email});

    Object.assign(user.admin, adminData);

    if (image) {
      user.admin.imgPath = image.path;
    }

    return await this.usersRepository.save(user);
  }

  async updatePassword({id, password}: UpdateUserPasswordDto): Promise<User> {
    const user = await this.findOne(+id);

    user.password = await this.hashingService.make(password);

    return await this.usersRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.findOne(+id);

    await this.usersRepository.softRemove(user);
  }
}
