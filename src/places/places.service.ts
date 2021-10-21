import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreatePlaceDto } from './dto/create-place.dto';
import { DeletePlaceDto } from './dto/delete-place.dto';
import { PlacePaginationOptionsDto } from './dto/place-pagination-options.dto';
import { Place } from './entities/place.entity';
import { Zone } from './entities/zone.entity';
import { PlaceNotFoundException } from './errors/place-not-found.exception';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place) private readonly placesRepository: Repository<Place>,
    @InjectRepository(Store) private readonly storesRepository: Repository<Store>
  ) {}

  async paginate({perPage, offset, filters: {
    id,
    name,
    storeId,
    storeName,
  }}: PlacePaginationOptionsDto): Promise<PaginationResult<Place>> {
    const queryBuilder = this.placesRepository.createQueryBuilder('place')
      .take(perPage)
      .skip(offset)
      .leftJoinAndSelect('place.zones', 'zone')
      .innerJoin('place.store', 'store');

    if (id) queryBuilder.andWhere('place.id = :id', { id });

    if (name) queryBuilder.andWhere('place.name LIKE :name', { name: `%${name}%` });

    if (storeId) queryBuilder.andWhere('place.storeId = :storeId', { storeId });

    if (storeName) queryBuilder.andWhere('store.name LIKE :storeName', { storeName: `%${storeName}%` });

    const [places, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(places, total, perPage);
  }

  async create({userId, zones, ...createPlaceDto}: CreatePlaceDto): Promise<Place> {
    const store = await this.storesRepository.createQueryBuilder('store')
      .where('store.userId = :userId', { userId })
      .getOne();

    if (!store) {
      throw new StoreNotFoundException();
    }

    const zoneEntities = zones.map((zone) => Zone.create(zone));

    const place = Place.create({
      ...createPlaceDto,
      store,
      zones: zoneEntities,
    });

    return await this.placesRepository.save(place);
  }

  async findOne(id: number): Promise<Place> {
    const place = await this.placesRepository.createQueryBuilder('place')
      .leftJoinAndSelect('place.zones', 'zone')
      .where('place.id = :id', { id })
      .getOne();

    if (!place) throw new PlaceNotFoundException();

    return place;
  }

  async delete({id, userId}: DeletePlaceDto): Promise<void> {
    const place = await this.placesRepository.createQueryBuilder('place')
      .innerJoin('place.store', 'store')
      .where('place.id = :id', { id })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!place) throw new PlaceNotFoundException();

    await this.placesRepository.softRemove(place);
  }
}
