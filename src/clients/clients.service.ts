import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/support/hashing.service';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { UserNotFoundException } from 'src/users/errors/user-not-found.exception';
import { Repository } from 'typeorm';
import { ClientPaginationOptionsDto } from './dto/client-pagination-options.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientPasswordDto } from './dto/update-client-password.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { ClientNotFoundException } from './errors/client-not-found.exception';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService
  ) {}

  async paginate({offset, perPage, filters}: ClientPaginationOptionsDto, userId: number): Promise<PaginationResult<User>> {
    const user = await this.usersRepository.findOne(userId);

    if (!user) throw new UserNotFoundException();

    const queryBuilder = this.usersRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.client', 'client')
      .innerJoinAndSelect('user.userStatus', 'userStatus')
      .take(perPage)
      .skip(offset);

    if (user.role === Role.STORE) {
      queryBuilder.innerJoin('user.order', 'order');
    }

    if (filters.id) queryBuilder.andWhere('user.id = :id', {id: filters.id});

    if (filters.userStatusCode) queryBuilder.andWhere('user.userStatusCode = :userStatusCode', {userStatusCode: filters.userStatusCode});

    if (filters.email) queryBuilder.andWhere('user.email LIKE :email', {email: `%${filters.email}%`});

    if (filters.name) queryBuilder.andWhere('client.name LIKE :name', {name: `%${filters.name}%`});

    if (filters.phoneNumber) queryBuilder.andWhere('client.phoneNumber LIKE :phoneNumber', {phoneNumber: `%${filters.phoneNumber}%`});

    const [clients, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(clients, total, perPage);
  }

  async create({name, phoneNumber, image, password, ...createClientDto}: CreateClientDto): Promise<User> {
    const user = User.create({
      ...createClientDto,
      password: await this.hashingService.make(password),
      role: Role.CLIENT,
    });

    user.client = Client.create({
      name,
      phoneNumber,
      imgPath: image.path,
    });

    return await this.usersRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {id, role: Role.CLIENT},
      relations: ['client', 'userStatus'],
    });

    if (!user) {
      throw new ClientNotFoundException();
    }

    return user;
  }

  async update({id, name, phoneNumber, image, ...updateClientDto}: UpdateClientDto): Promise<User> {
    const user = await this.findOne(+id);

    Object.assign(user, updateClientDto);

    Object.assign(user.client, {name, phoneNumber});

    if (image) {
      user.client.imgPath = image.path;
    }

    return await this.usersRepository.save(user);
  }

  async updatePassword({id, password}: UpdateClientPasswordDto): Promise<User> {
    const user = await this.findOne(+id);

    user.password = await this.hashingService.make(password);

    return await this.usersRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.findOne(id);

    await this.usersRepository.softRemove(user);
  }
}
