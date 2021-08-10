import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { FindConditions, Like, Repository } from 'typeorm';
import { CardIssuerPaginationOptionsDto } from './dto/card-issuer-pagination-options.dto';
import { CreateCardIssuerDto } from './dto/create-card-issuer.dto';
import { UpdateCardIssuerDto } from './dto/update-card-issuer.dto';
import { CardIssuer } from './entities/card-issuer.entity';
import { CardIssuerNotFoundException } from './errors/card-issuers-not-found.exception';

@Injectable()
export class CardIssuersService {
  constructor(@InjectRepository(CardIssuer) private readonly cardIssuersRepository: Repository<CardIssuer>) {}

  async paginate({offset, perPage, filters}: CardIssuerPaginationOptionsDto): Promise<PaginationResult<CardIssuer>> {
    const where: FindConditions<CardIssuer> = {};

    // @ts-ignore
    if (filters.id) where.id = +filters.id;

    if (filters.name) where.name = Like(`%${filters.name}%`);

    if (filters.cardIssuerTypeId) where.cardIssuerTypeId = filters.cardIssuerTypeId;

    const [cardIssuers, total] = await this.cardIssuersRepository.findAndCount({
      take: perPage,
      skip: offset,
      where,
      relations: ['cardIssuerType'],
    });

    return new PaginationResult(cardIssuers, total, perPage);
  }

  async create({image, ...createIssuerDto}: CreateCardIssuerDto): Promise<CardIssuer> {
    const cardIssuer = CardIssuer.create({
      ...createIssuerDto,
      imgPath: image.path,
    });

    return await this.cardIssuersRepository.save(cardIssuer);
  }

  async findOne(id: number): Promise<CardIssuer> {
    const cardIssuer = await this.cardIssuersRepository.findOne({
      where: { id },
      relations: ['cardIssuerType'],
    });

    if (!cardIssuer) {
      throw new CardIssuerNotFoundException();
    }

    return cardIssuer;
  }

  async update({id, image, ...updateBankDto}: UpdateCardIssuerDto): Promise<CardIssuer> {
    const cardIssuer = await this.findOne(+id);

    Object.assign(cardIssuer, updateBankDto);

    if (image) cardIssuer.imgPath = image.path;

    return await this.cardIssuersRepository.save(cardIssuer);
  }

  async delete(id: number): Promise<void> {
    const cardIssuer = await this.findOne(id);

    await this.cardIssuersRepository.softRemove(cardIssuer);
  }
}
