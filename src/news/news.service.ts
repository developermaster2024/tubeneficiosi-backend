import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { DeleteNewsDto } from './dto/delete-news.dto';
import { NewsPaginationOptionsDto } from './dto/news-pagination-options.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { NewsNotFoundException } from './errors/news-not-found.exception';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private readonly newsRepository: Repository<News>,
    @InjectRepository(Store) private readonly storesRepository: Repository<Store>
  ) {}

  async paginate({perPage, offset, filters: {
    id,
    title,
    storeId,
  }}: NewsPaginationOptionsDto): Promise<PaginationResult<News>> {
    const queryBuilder = this.newsRepository.createQueryBuilder('news')
      .innerJoinAndSelect('news.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('news.id = :id', { id });

    if (title) queryBuilder.andWhere('news.title LIKE :title', { title: `%${title}%` });

    if (storeId) queryBuilder.andWhere('news.storeId = :storeId', { storeId });

    const [news, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(news, total, perPage);
  }

  async create({userId, image, ...createNewsDto}: CreateNewsDto): Promise<News> {
    const store = await this.storesRepository.createQueryBuilder('store')
      .where('store.userId = :userId', { userId })
      .getOne();

    if (!store) throw new StoreNotFoundException();

    const news = News.create({
      ...createNewsDto,
      imgPath: image.path,
      store,
    });

    return await this.newsRepository.save(news);
  }

  async findOne(id: number): Promise<News> {
    const news = await this.newsRepository.createQueryBuilder('news')
      .where('news.id = :id', { id })
      .getOne();

    if (!news) throw new NewsNotFoundException();

    return news;
  }

  async update({id, userId, image, ...updateNewsDto}: UpdateNewsDto): Promise<News> {
    const news = await this.newsRepository.createQueryBuilder('news')
      .innerJoin('news.store', 'store')
      .where('news.id = :id', { id })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!news) throw new NewsNotFoundException();

    Object.assign(news, updateNewsDto);

    if (image) news.imgPath = image.path;

    return await this.newsRepository.save(news);
  }

  async delete({id, userId}: DeleteNewsDto): Promise<void> {
    const news = await this.newsRepository.createQueryBuilder('news')
      .innerJoin('news.store', 'store')
      .where('news.id = :id', { id })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!news) throw new NewsNotFoundException();

    await this.newsRepository.remove(news);
  }
}
