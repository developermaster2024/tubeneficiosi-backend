import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { FindConditions, Like, Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationPaginationOptionsDto } from './dto/location-pagination-options.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { LocationNotFoundException } from './errors/location-not-found.exception';

@Injectable()
export class LocationsService {
  constructor(@InjectRepository(Location) private readonly locationsRepository: Repository<Location>) {}

  async paginate({offset, perPage, filters: {
    id,
    name,
    parentId,
    excludeIds,
  }}: LocationPaginationOptionsDto): Promise<PaginationResult<Location>> {
    const queryBuilder = this.locationsRepository.createQueryBuilder('location')
      .take(perPage)
      .skip(offset)
      .innerJoinAndSelect('location.parentLocation', 'parentLocation');

    if (id) queryBuilder.andWhere('location.id = :id', { id });

    if (name) queryBuilder.andWhere('location.name LIKE :name', { name: `%${name}%` });

    if (parentId) queryBuilder.andWhere('location.parentId = :parentId', { parentId });

    if (excludeIds.length > 0) queryBuilder.andWhere('location.id NOT IN (:...excludeIds)', { excludeIds });

    const [locations, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(locations, total, perPage);
  }

  async create({area, ...createLocationDto}: CreateLocationDto): Promise<Location> {
    const location = Location.create({
      ...createLocationDto,
      area: `MULTIPOLYGON(${area})`
    });

    return await this.locationsRepository.save(location);
  }

  async findOne(id: number): Promise<Location> {
    const location = await this.locationsRepository.findOne({
      where: { id },
      relations: ['parentLocation'],
    });

    if (!location) {
      throw new LocationNotFoundException();
    }

    return location;
  }

  async update({id, area, ...updateLocationDto}: UpdateLocationDto): Promise<Location> {
    const location = await this.findOne(+id);

    Object.assign(location, updateLocationDto);

    if (area) {
      location.area = `MULTIPOLYGON(${area})`;
    }

    return await this.locationsRepository.save(location);
  }

  async delete(id: number): Promise<void> {
    const location = await this.findOne(id);

    await this.locationsRepository.softRemove(location);
  }
}
