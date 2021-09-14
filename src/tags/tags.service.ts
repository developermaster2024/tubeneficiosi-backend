import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { FindConditions, In, Like, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagPaginationOptionsDto } from './dto/tag-pagination-options.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TagNotFoundException } from './errors/tag-not-found.exception';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>) {}

  async paginate({perPage, offset, filters: {
    id,
    name,
    storeCategoryIds,
    excludeIds,
  }}: TagPaginationOptionsDto): Promise<PaginationResult<Tag>> {
    const queryBuilder = this.tagsRepository.createQueryBuilder('tag')
      .take(perPage)
      .skip(offset)
      .innerJoinAndSelect('tag.storeCategory', 'storeCategory')
      .leftJoinAndSelect('tag.parentTags', 'parentTag');

    if (id) queryBuilder.andWhere('tag.id = :id', { id });

    if (name) queryBuilder.andWhere('tag.name LIKE :name', { name: `%${name}%` });

    if (storeCategoryIds.length > 0) queryBuilder.andWhere('tag.storeCategoryId IN (:...storeCategoryIds)', { storeCategoryIds });

    if (excludeIds.length > 0) queryBuilder.andWhere('tag.id NOT IN (:...excludeIds)', { excludeIds });

    const [tags, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(tags, total, perPage);
  }

  async create({parentIds, ...createTagDto}: CreateTagDto): Promise<Tag> {
    const parentTags = parentIds.length === 0 ? [] : await this.tagsRepository.find({
      where: {id: In(parentIds)}
    });

    const tag = Tag.create({...createTagDto, parentTags});

    return await this.tagsRepository.save(tag);
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagsRepository.findOne({
      where: {id},
      relations: ['storeCategory', 'parentTags'],
    });

    if (!tag) {
      throw new TagNotFoundException();
    }

    return tag;
  }

  async udpate({id, parentIds, ...updateTagDto}: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);

    const parentTags = parentIds.length === 0 ? [] : await this.tagsRepository.find({
      where: {id: In(parentIds)}
    });

    Object.assign(tag, {...updateTagDto, parentTags});

    return await this.tagsRepository.save(tag);
  }

  async delete(id: number): Promise<void> {
    const tag = await this.findOne(id);

    await this.tagsRepository.softRemove(tag);
  }
}
