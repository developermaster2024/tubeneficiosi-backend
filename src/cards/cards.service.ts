import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CardPaginationOptionsDto } from './dto/card-pagination-options.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';
import { CardNotFoundException } from './errors/card-not-found.exception';

@Injectable()
export class CardsService {
  constructor(@InjectRepository(Card) private readonly cardsRepository: Repository<Card>) {}

  async paginate({perPage, offset, filters: {
    id,
    name,
    cardIssuerId,
    cardIssuerName,
    cardTypeId,
    isOwnedById,
  }}: CardPaginationOptionsDto): Promise<PaginationResult<Card>> {
    const queryBuilder = this.cardsRepository.createQueryBuilder('card')
      .take(perPage)
      .skip(offset)
      .innerJoinAndSelect('card.cardIssuer', 'cardIssuer')
      .innerJoinAndSelect('card.cardType', 'cardType')
      .leftJoin('card.clientToCards', 'clientToCard');

    if (id) queryBuilder.andWhere('card.id = :id', { id });

    if (name) queryBuilder.andWhere('card.name LIKE :name', { name: `%${name}%` });

    if (cardIssuerId) queryBuilder.andWhere('card.cardIssuerId = :cardIssuerId', { cardIssuerId });

    if (cardTypeId) queryBuilder.andWhere('card.cardTypeId = :cardTypeId', { cardTypeId });

    if (cardIssuerName) queryBuilder.andWhere('cardIssuer.name LIKE :cardIssuerName', { cardIssuerName: `%${cardIssuerName}%` });

    if (isOwnedById) queryBuilder.andWhere('clientToCard.userId = :isOwnedById', { isOwnedById });

    const [cards, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(cards, total, perPage);
  }

  async create({image, ...createCardDto}: CreateCardDto): Promise<Card> {
    const card = Card.create({
      ...createCardDto,
      imgPath: image.path,
    });

    return await this.cardsRepository.save(card);
  }

  async findOne(id: number, relations = ['cardIssuer', 'cardType']): Promise<Card> {
    const card = await this.cardsRepository.findOne({
      where: { id },
      relations,
    });

    if (!card) {
      throw new CardNotFoundException();
    }

    return card;
  }

  async update({id, image, ...updateCardDto}: UpdateCardDto): Promise<Card> {
    const card = await this.findOne(id, []);

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
