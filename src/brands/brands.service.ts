import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { FindConditions, Like, Repository } from 'typeorm';
import { BrandPaginationOptionsDto } from './dto/brand-pagination-options.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { BrandNotFoundException } from './errors/brand-not-found.exception';

@Injectable()
export class BrandsService {
  constructor(@InjectRepository(Brand) private readonly brandsRepository: Repository<Brand>) {}

  async paginate({offset, perPage, filters}: BrandPaginationOptionsDto): Promise<PaginationResult<Brand>> {
    const where: FindConditions<Brand> = {};

    // @ts-ignore
    if (filters.id) where.id = filters.id;

    if (filters.name) where.name = Like(`%${filters.name}%`);

    const [brands, total] = await this.brandsRepository.findAndCount({
      take: perPage,
      skip: offset,
      where
    });

    return new PaginationResult(brands, total, perPage);
  }

  async create(createBrandDto: CreateBrandDto): Promise<CreateBrandDto> {
    const brand = Brand.create(createBrandDto);

    return await this.brandsRepository.save(brand);
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandsRepository.findOne(id);

    if (!brand) {
      throw new BrandNotFoundException();
    }

    return brand;
  }

  async update({id, ...updateBrandDto}: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);

    Object.assign(brand, updateBrandDto);

    return await this.brandsRepository.save(brand);
  }

  async delete(id: number): Promise<void> {
    const brand = await this.findOne(id);

    await this.brandsRepository.softRemove(brand);
  }
}
