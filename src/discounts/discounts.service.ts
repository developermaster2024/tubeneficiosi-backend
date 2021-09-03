import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardIssuer } from 'src/card-issuers/entities/card-issuer.entity';
import { Card } from 'src/cards/entities/card.entity';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Discount } from './entities/discount.entity';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount) private readonly discountsRepository: Repository<Discount>,
    @InjectRepository(Card) private readonly cardsRepository: Repository<Card>,
    @InjectRepository(CardIssuer) private readonly cardIssuerRepository: Repository<CardIssuer>,
    @InjectRepository(Store) private readonly storesRepository: Repository<Store>
  ) {}

  async create({cardIds, cardIssuerIds, userId, image, ...createDiscountDto}: CreateDiscountDto): Promise<Discount> {
    const store = await this.storesRepository.createQueryBuilder('store')
      .innerJoin('store.user', 'user')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!store) throw new StoreNotFoundException();

    const cards = await this.cardsRepository.createQueryBuilder('card')
      .where('card.id IN (:...cardIds)', { cardIds })
      .getMany();

    const cardIssuers = await this.cardIssuerRepository.createQueryBuilder('cardIssuer')
      .where('cardIssuer.id IN (:...cardIssuerIds)', { cardIssuerIds })
      .getMany();

    const discount = Discount.create({
      ...createDiscountDto,
      imgPath: image.path,
      storeId: store.id,
      cards,
      cardIssuers,
    });

    return await this.discountsRepository.save(discount);
  }
}
