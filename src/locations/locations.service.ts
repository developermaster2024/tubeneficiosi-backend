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

  async paginate({offset, perPage, filters}: LocationPaginationOptionsDto): Promise<PaginationResult<Location>> {
    const where: FindConditions<Location> = {};

    // @ts-ignore
    if (filters.id) where.id = +filters.id;

    if (filters.name) where.name = Like(`%${filters.name}%`);

    if (filters.parentId) where.parentId = +filters.parentId;

    const [locations, total] = await this.locationsRepository.findAndCount({
      take: perPage,
      skip: offset,
      where,
      relations: ['parentLocation']
    });

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
