import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { DeleteRoomDto } from './dto/delete-room.dto';
import { RoomPaginationOptionsDto } from './dto/room-pagination-options.dto';
import { Room } from './entities/room.entity';
import { SeatGroup } from './entities/seat-group.entity';
import { RoomNotFoundException } from './errors/room-not-found.exception';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly roomsRepository: Repository<Room>,
    @InjectRepository(Store) private readonly storesRepository: Repository<Store>
  ) {}

  async paginate({perPage, offset, filters: {
    id,
    name,
    storeId,
    storeName,
  }}: RoomPaginationOptionsDto): Promise<PaginationResult<Room>> {
    const queryBuilder = this.roomsRepository.createQueryBuilder('room')
      .take(perPage)
      .skip(offset)
      .leftJoinAndSelect('room.seatGroups', 'seatGroup')
      .innerJoin('room.store', 'store');

    if (id) queryBuilder.andWhere('room.id = :id', { id });

    if (name) queryBuilder.andWhere('room.name LIKE :name', { name: `%${name}%` });

    if (storeId) queryBuilder.andWhere('room.storeId = :storeId', { storeId });

    if (storeName) queryBuilder.andWhere('store.name LIKE :storeName', { storeName: `%${storeName}%` });

    const [rooms, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(rooms, total, perPage);
  }

  async create({userId, seatGroups, ...createRoomDto}: CreateRoomDto): Promise<Room> {
    const store = await this.storesRepository.createQueryBuilder('store')
      .where('store.userId = :userId', { userId })
      .getOne();

    if (!store) {
      throw new StoreNotFoundException();
    }

    const seatGroupEntities = seatGroups.map((seatGroup) => SeatGroup.create(seatGroup));

    const room = Room.create({
      ...createRoomDto,
      store,
      seatGroups: seatGroupEntities,
    });

    return await this.roomsRepository.save(room);
  }

  async findOne(id: number): Promise<Room> {
    const room = await this.roomsRepository.createQueryBuilder('room')
      .leftJoinAndSelect('room.seatGroups', 'seatGroup')
      .where('room.id = :id', { id })
      .getOne();

    if (!room) throw new RoomNotFoundException();

    return room;
  }

  async delete({id, userId}: DeleteRoomDto): Promise<void> {
    const room = await this.roomsRepository.createQueryBuilder('room')
      .innerJoin('room.store', 'store')
      .where('room.id = :id', { id })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!room) throw new RoomNotFoundException();

    await this.roomsRepository.softRemove(room);
  }
}
