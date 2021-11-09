import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { AddZoneDto } from './dto/add-zone.dto';
import { CreatePlaceDto } from './dto/create-place.dto';
import { DeletePlaceDto } from './dto/delete-place.dto';
import { DeleteZoneDto } from './dto/delete-zone.dto';
import { PlacePaginationOptionsDto } from './dto/place-pagination-options.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { Place } from './entities/place.entity';
import { Zone } from './entities/zone.entity';
import { PlaceNotFoundException } from './errors/place-not-found.exception';
import { ZoneNotFoundException } from './errors/zone-not-found.exception';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place) private readonly placesRepository: Repository<Place>,
    @InjectRepository(Zone) private readonly zonesRepository: Repository<Zone>,
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

  async create({userId, zones, image, ...createPlaceDto}: CreatePlaceDto): Promise<Place> {
    const store = await this.storesRepository.createQueryBuilder('store')
      .where('store.userId = :userId', { userId })
      .getOne();

    if (!store) {
      throw new StoreNotFoundException();
    }

    const zoneEntities = zones.map((zone) => Zone.create(zone));

    const place = Place.create({
      ...createPlaceDto,
      imgPath: image.path,
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

  async update({id, userId, image, ...updatePlaceDto}: UpdatePlaceDto): Promise<Place> {
    const place = await this.placesRepository.createQueryBuilder('place')
      .leftJoinAndSelect('place.zones', 'zone')
      .where('place.id = :id', { id })
      .getOne();

    if (!place) throw new PlaceNotFoundException();

    Object.assign(place, updatePlaceDto);

    if (image) {
      place.imgPath = image.path;
    }

    return await this.placesRepository.save(place);
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

  async addZone({placeId, userId, ...addZoneDto}: AddZoneDto): Promise<Place> {
    const place = await this.placesRepository.createQueryBuilder('place')
      .leftJoinAndSelect('place.zones', 'zone')
      .innerJoin('place.store', 'store')
      .where('place.id = :placeId', { placeId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!place) throw new PlaceNotFoundException();

    const zone = Zone.create({
      ...addZoneDto,
      place,
    });

    await this.zonesRepository.save(zone);

    const updatedPlace = await this.placesRepository.createQueryBuilder('place')
      .leftJoinAndSelect('place.zones', 'zone')
      .where('place.id = :id', { id: place.id })
      .getOne();

    return updatedPlace;
  }

  async updateZone({zoneId, userId, ...updateZoneDto}: UpdateZoneDto): Promise<Place> {
    const zone = await this.zonesRepository.createQueryBuilder('zone')
      .innerJoinAndSelect('zone.place', 'place')
      .innerJoin('place.store', 'store')
      .where('zone.id = :zoneId', { zoneId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!zone) throw new ZoneNotFoundException();

    Object.assign(zone, updateZoneDto);

    await this.zonesRepository.save(zone);

    const place = await this.placesRepository.createQueryBuilder('place')
      .leftJoinAndSelect('place.zones', 'zone')
      .where('place.id = :id', { id: zone.place.id })
      .getOne();

    if (!place) throw new PlaceNotFoundException();

    return place;
  }

  async deleteZone({zoneId, userId}: DeleteZoneDto): Promise<Place> {
    const place = await this.placesRepository.createQueryBuilder('place')
      .leftJoinAndSelect('place.zones', 'zone')
      .innerJoin('place.store', 'store')
      .where('store.userId = :userId', { userId })
      .getOne();

    if (!place) throw new PlaceNotFoundException();

    const zone = await this.zonesRepository.createQueryBuilder('zone')
      .innerJoin('zone.place', 'place')
      .innerJoin('place.store', 'store')
      .where('zone.id = :zoneId', { zoneId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!zone) throw new ZoneNotFoundException();

    await this.zonesRepository.remove(zone);

    const updatedPlace = await this.placesRepository.createQueryBuilder('place')
      .leftJoinAndSelect('place.zones', 'zone')
      .where('place.id = :id', { id: place.id })
      .getOne();

    return updatedPlace;
  }
}
