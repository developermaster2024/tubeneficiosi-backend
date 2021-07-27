import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { FindConditions, Like, Repository } from 'typeorm';
import { CardPaginationOptionsDto } from './dto/card-pagination-options.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';
import { CardNotFoundException } from './errors/card-not-found.exception';

@Injectable()
export class CardsService {
  constructor(@InjectRepository(Card) private readonly cardsRepository: Repository<Card>) {}

  async paginate({perPage, offset, filters}: CardPaginationOptionsDto): Promise<PaginationResult<Card>> {
    const where: FindConditions<Card> = {};

    // @ts-ignore
    if (filters.id) where.id = +filters.id;

    if (filters.name) where.name = Like(`%${filters.name}%`);

    if (filters.cardIssuerId) where.cardIssuerId = filters.cardIssuerId;

    if (filters.cardTypeId) where.cardTypeId = filters.cardTypeId;

    const [cards, total] = await this.cardsRepository.findAndCount({
      take: perPage,
      skip: offset,
      where,
      relations: ['cardIssuer', 'cardType'],
    });

    return new PaginationResult(cards, total, perPage);
  }

  async create({image, ...createCardDto}: CreateCardDto): Promise<Card> {
    const card = Card.create({
      ...createCardDto,
      imgPath: image.path,
    });

    return await this.cardsRepository.save(card);
  }

  async findOne(id: number): Promise<Card> {
    const card = await this.cardsRepository.findOne({
      where: { id },
      relations: ['cardIssuer', 'cardType'],
    });

    if (!card) {
      throw new CardNotFoundException();
    }

    return card;
  }

  async update({id, image, ...updateCardDto}: UpdateCardDto): Promise<Card> {
    const card = await this.findOne(id);

    Object.assign(card, updateCardDto);

    if (image) {
      card.imgPath = image.path;
    }

    return await this.cardsRepository.save(card);
  }

  async delete(id: number): Promise<void> {
    const card = await this.findOne(id);

    await this.cardsRepository.softRemove(card);
  }
}
