import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardIssuer } from 'src/card-issuers/entities/card-issuer.entity';
import { Card } from 'src/cards/entities/card.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { UserToNotification } from 'src/notifications/entities/user-to-notification.entity';
import { NotificationTypes } from 'src/notifications/enums/notification-types.enum';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { User } from 'src/users/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { DiscountPaginationOptionsDto } from './dto/discount-pagination-options.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Discount } from './entities/discount.entity';
import { DiscountNotFoundException } from './errors/discount-not-found.exception';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount) private readonly discountsRepository: Repository<Discount>,
    @InjectRepository(Card) private readonly cardsRepository: Repository<Card>,
    @InjectRepository(CardIssuer) private readonly cardIssuerRepository: Repository<CardIssuer>,
    @InjectRepository(Store) private readonly storesRepository: Repository<Store>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async paginate({perPage, offset, filters: {
    id,
    storeIds,
    cardIssuerIds,
    cardIds,
    minValue,
    maxValue,
    isActive,
    minDate,
    maxDate,
    name,
    storeCategoryIds,
    discountTypeCode,
  }}: DiscountPaginationOptionsDto): Promise<PaginationResult<Discount>> {
    const queryBuilder = this.discountsRepository.createQueryBuilder('discount')
      .innerJoinAndSelect('discount.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .innerJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndSelect('discount.cardIssuers', 'cardIssuer')
      .leftJoinAndSelect('cardIssuer.cardIssuerType', 'cardIssuerType')
      .leftJoinAndSelect('discount.cards', 'card')
      .leftJoinAndSelect('card.cardIssuer', 'cardIssuerFromCard')
      .leftJoinAndSelect('cardIssuerFromCard.cardIssuerType', 'cardIssuerTypeFromCard')
      .leftJoinAndSelect('card.cardType', 'cardType')
      .leftJoinAndSelect('discount.discountType', 'discountType')
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('discount.id = :id', { id });

    if (storeIds.length > 0) queryBuilder.andWhere('store.id In (:...storeIds)', { storeIds });

    if (cardIssuerIds.length > 0) queryBuilder
      .andWhere(new Brackets(qb => {
        qb
          .andWhere('cardIssuer.id In (:...cardIssuerIds)', { cardIssuerIds })
          .orWhere('cardIssuerFromCard.id IN (:...cardIssuerIds)', { cardIssuerIds });
      }));

    if (cardIds.length > 0) queryBuilder.andWhere('card.id In (:...cardIds)', { cardIds });

    if (minValue) queryBuilder.andWhere('discount.value >= :minValue', { minValue });

    if (maxValue) queryBuilder.andWhere('discount.value <= :maxValue', { maxValue });

    if (isActive !== null) {
      const condition = isActive
        ? 'discount.from <= :today AND discount.until >= :today'
        : 'discount.from >= :today OR discount.until <= :today';

      queryBuilder.andWhere(condition, { today: new Date() });
    }

    if (minDate) queryBuilder.andWhere('discount.from >= :minDate', { minDate });

    if (maxDate) queryBuilder.andWhere('discount.until <= :maxDate', { maxDate });

    if (name) queryBuilder.andWhere('discount.name LIKE :name', { name: `%${name}%` });

    if (storeCategoryIds.length > 0) queryBuilder.andWhere('store.storeCategoryId IN (:...storeCategoryIds)', { storeCategoryIds });

    if (discountTypeCode) queryBuilder.andWhere('discount.discountTypeCode = :discountTypeCode', { discountTypeCode });

    const [discounts, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(discounts, total, perPage);
  }

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

    const savedDiscount = await this.discountsRepository.save(discount);

    const usersToNotify = await this.usersRepository.createQueryBuilder('user').select(['user.id']).getMany();

    const userToNotifications = usersToNotify.map(user => UserToNotification.create({ userId: user.id }));

    const notification = await this.notificationsRepository.save(Notification.create({
      message: `La tienda ${store.name} ha registrado un descuento`,
      type: NotificationTypes.NEW_DISCOUNT,
      additionalData: { storeId: store.id },
      userToNotifications,
    }));

    const userIds = userToNotifications.map(utn => utn.userId);

    this.notificationsService.notifyUsersById(userIds, notification);

    return savedDiscount;
  }

  async findOne(id: number): Promise<Discount> {
    const discount = await this.discountsRepository.createQueryBuilder('discount')
      .innerJoinAndSelect('discount.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .innerJoinAndSelect('store.storeHours', 'storeHour')
      .leftJoinAndSelect('discount.cardIssuers', 'cardIssuer')
      .leftJoinAndSelect('discount.cards', 'card')
      .leftJoinAndSelect('card.cardIssuer', 'cardIssuerFromCard')
      .leftJoinAndSelect('card.cardType', 'cardType')
      .leftJoinAndSelect('discount.discountType', 'discountType')
      .where('discount.id = :id', { id })
      .getOne();

    if (!discount) {
      throw new DiscountNotFoundException();
    }

    return discount;
  }

  async update({id, userId, image, ...updateDiscountDto}: UpdateDiscountDto): Promise<Discount> {
    const discount = await this.discountsRepository.createQueryBuilder('discount')
      .innerJoin('discount.store', 'store')
      .leftJoinAndSelect('discount.cardIssuers', 'cardIssuer')
      .leftJoinAndSelect('discount.cards', 'card')
      .where('discount.id = :id', { id })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!discount) throw new DiscountNotFoundException();

    Object.assign(discount, updateDiscountDto);

    if (image) {
      discount.imgPath = image.path;
    }

    return await this.discountsRepository.save(discount);
  }

  async delete(id: number, userId: number): Promise<void> {
    const discount = await this.discountsRepository.createQueryBuilder('discount')
      .innerJoin('discount.store', 'store')
      .where('discount.id = :id', { id })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!discount) {
      throw new DiscountNotFoundException();
    }

    await this.discountsRepository.softRemove(discount);
  }
}
