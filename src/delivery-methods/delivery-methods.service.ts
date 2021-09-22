import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryMethodTypes } from 'src/delivery-method-types/enums/delivery-methods-types.enum';
import { Location } from 'src/locations/entities/location.entity';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { CalculateCostDto } from './dto/calculate-cost.dto';
import { CreateDeliveryMethodDto } from './dto/create-delivery-method.dto';
import { CreateDeliveryZoneToRangeDto } from './dto/create-delivery-zone-to-range.dto';
import { CreateShippingZoneToRangeDto } from './dto/create-shipping-zone-to-range.dto';
import { DeliveryMethodPaginationOptionsDto } from './dto/delivery-method-pagination-options.dto';
import { UpdateDeliveryMethodDto } from './dto/update-delivery-method.dto';
import { DeliveryMethod } from './entities/delivery-method.entity';
import { DeliveryRange } from './entities/delivery-range.entity';
import { DeliveryZoneToDeliveryRange } from './entities/delivery-zone-to-delivery-range.entity';
import { DeliveryZoneToShippingRange } from './entities/delivery-zone-to-shipping-range.entity';
import { DeliveryZone } from './entities/delivery-zone.entity';
import { ShippingRange } from './entities/shipping-range.entity';
import { DeliveryMethodNotFoundException } from './errors/delivery-method-not-found.exception';
import { Cart } from 'src/carts/entities/cart.entity';
import { CartNotFoundException } from 'src/carts/errors/cart-not-found.exception';
import { DeliveryCostCalculatorResolver } from './support/delivery-cost-calculator-resolver';

@Injectable()
export class DeliveryMethodsService {
  constructor(
    @InjectRepository(DeliveryMethod) private readonly deliveryMethodsRepository: Repository<DeliveryMethod>,
    @InjectRepository(Location) private readonly locationsRepository: Repository<Location>,
    @InjectRepository(DeliveryZoneToShippingRange) private readonly deliveryZoneToShippingRangesRepository: Repository<DeliveryZoneToShippingRange>,
    @InjectRepository(DeliveryZoneToDeliveryRange) private readonly deliveryZoneToDeliveryRangesRepository: Repository<DeliveryZoneToDeliveryRange>,
    @InjectRepository(Store) private readonly storesRepository: Repository<Store>,
    @InjectRepository(Cart) private readonly cartsRepository: Repository<Cart>,
    private readonly deliveryCostCalculatorResolver: DeliveryCostCalculatorResolver
  ) {}

  async paginate({perPage, offset, filters: {
    id,
    deliveryMethodTypeCode,
    name,
    storeId,
    addressId,
  }}: DeliveryMethodPaginationOptionsDto): Promise<PaginationResult<DeliveryMethod>> {
    const queryBuilder = this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .take(perPage)
      .skip(offset)
      .innerJoinAndSelect('deliveryMethod.deliveryMethodType', 'deliveryMethodType');

    if (id) queryBuilder.andWhere('deliveryMethod.id = :id', { id });

    if (deliveryMethodTypeCode) queryBuilder.andWhere('deliveryMethod.deliveryMethodTypeCode = :deliveryMethodTypeCode', { deliveryMethodTypeCode });

    if (name) queryBuilder.andWhere('deliveryMethod.name LIKE :name', { name: `%${name}%` });

    if (storeId) queryBuilder.andWhere('deliveryMethod.storeId = :storeId', { storeId });

    if (addressId) {
      queryBuilder
        .innerJoin('deliveryMethod.deliveryZones', 'deliveryZone')
        .innerJoin('deliveryZone.locations', 'location', `ST_CONTAINS(location.area, (
          SELECT
            POINT(address.latitude, address.longitude)
          FROM
            client_addresses address
          WHERE
            address.id = :addressId AND address.deleted_at IS NULL
          LIMIT 1
        ))`, { addressId });
    }

    const [deliveryMethods, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(deliveryMethods, total, perPage);
  }

  async create({userId, image, deliveryZoneToRanges, ...createDeliveryMethodDto}: CreateDeliveryMethodDto): Promise<DeliveryMethod> {
    const store = await this.findStoreByUserId(userId);

    let deliveryMethod = DeliveryMethod.create({
      ...createDeliveryMethodDto,
      imgPath: image.path,
      store,
    });

    switch(createDeliveryMethodDto.deliveryMethodTypeCode) {
      case DeliveryMethodTypes.SHIPPING: {
        // Guardar las zonas
        deliveryMethod.deliveryZones = await Promise.all(deliveryZoneToRanges.map(async ({ deliveryZone }) => DeliveryZone.create({
          name: deliveryZone.name,
          extraPrice: deliveryZone.extraPrice,
          locations: await this.locationsRepository.findByIds(deliveryZone.locationIds),
        })));

        const sortedShippingRanges = deliveryZoneToRanges[0].deliveryRanges.sort((a, b) => a.weightFrom - b.weightFrom);

        // Guardar los rangos de envío
        deliveryMethod.shippingRanges = sortedShippingRanges.map((shippingRange, i) => ShippingRange.create({
          position: i,
          weightFrom: shippingRange.weightFrom,
          weightTo: shippingRange.weightTo,
          volumeFrom: shippingRange.volumeFrom,
          volumeTo: shippingRange.volumeTo,
        }));

        deliveryMethod = await this.deliveryMethodsRepository.save(deliveryMethod);

        const deliveryZonePrices = (deliveryZoneToRanges as CreateShippingZoneToRangeDto[]).reduce((result, shippingZoneToRange) => Object.assign(result, {
          [shippingZoneToRange.deliveryZone.name]: shippingZoneToRange.deliveryRanges.map(shippingRange => shippingRange.price),
        }), {});

        // Guardar los deliveryZoneToRanges
        const deliveryZoneToShippingRanges = deliveryMethod.deliveryZones.map(deliveryZone => deliveryMethod.shippingRanges.map((shippingRange, i) => DeliveryZoneToShippingRange.create({
          price: deliveryZonePrices[deliveryZone.name][i],
          deliveryZone,
          shippingRange,
        }))).reduce((result, item) => result.concat(item), []);

        await this.deliveryZoneToShippingRangesRepository.save(deliveryZoneToShippingRanges);
        break;
      }
      case DeliveryMethodTypes.DELIVERY: {
        // Guardar las zonas
        deliveryMethod.deliveryZones = await Promise.all(deliveryZoneToRanges.map(async ({ deliveryZone }) => DeliveryZone.create({
          name: deliveryZone.name,
          extraPrice: deliveryZone.extraPrice,
          locations: await this.locationsRepository.findByIds(deliveryZone.locationIds),
        })));

        const sortedDeliveryRanges = deliveryZoneToRanges[0].deliveryRanges.sort((a, b) => a.minProducts - b.minProducts);

        // Guardar los rangos de envío
        deliveryMethod.deliveryRanges = sortedDeliveryRanges.map((deliveryRange, i) => DeliveryRange.create({
          position: i,
          minProducts: deliveryRange.minProducts,
          maxProducts: deliveryRange.maxProducts,
        }));

        deliveryMethod = await this.deliveryMethodsRepository.save(deliveryMethod);

        const deliveryZonePrices = (deliveryZoneToRanges as CreateDeliveryZoneToRangeDto[]).reduce((result, deliveryZoneToRange) => Object.assign(result, {
          [deliveryZoneToRange.deliveryZone.name]: deliveryZoneToRange.deliveryRanges.map(deliveryRange => deliveryRange.price),
        }), {});

        // Guardar los deliveryZoneToRanges
        const deliveryZoneToDeliveryRanges = deliveryMethod.deliveryZones.map(deliveryZone => deliveryMethod.deliveryRanges.map((deliveryRange, i) => DeliveryZoneToDeliveryRange.create({
          price: deliveryZonePrices[deliveryZone.name][i],
          deliveryZone,
          deliveryRange,
        }))).reduce((result, item) => result.concat(item), []);

        await this.deliveryZoneToDeliveryRangesRepository.save(deliveryZoneToDeliveryRanges);
        break;
      }
    }

    return deliveryMethod;
  }

  async findOne(id: number): Promise<DeliveryMethod> {
    const deliveryMethod = await this.deliveryMethodsRepository.findOne(id);

    if (!deliveryMethod) {
      throw new DeliveryMethodNotFoundException();
    }

    return deliveryMethod;
  }

  async update({id, userId, image, ...updateDeliveryMethodDto}: UpdateDeliveryMethodDto): Promise<DeliveryMethod> {
    const store = await this.findStoreByUserId(userId);

    const deliveryMethod = await this.deliveryMethodsRepository.findOne({
      id: +id,
      store,
    });

    if (!deliveryMethod) {
      throw new DeliveryMethodNotFoundException();
    }

    Object.assign(deliveryMethod, updateDeliveryMethodDto);

    if (image) {
      deliveryMethod.imgPath = image.path;
    }

    return await this.deliveryMethodsRepository.save(deliveryMethod);
  }

  private async findStoreByUserId(userId: number): Promise<Store> {
    const store = await this.storesRepository.findOne({ userId });

    if (!store) {
      throw new StoreNotFoundException();
    }

    return store;
  }

  async delete(id: number, userId: number): Promise<void> {
    const store = await this.findStoreByUserId(userId);

    const deliveryMethod = await this.deliveryMethodsRepository.findOne({
      id: id,
      store,
    });

    if (!deliveryMethod) {
      throw new DeliveryMethodNotFoundException();
    }

    await this.deliveryMethodsRepository.softRemove(deliveryMethod);
  }

  async calculateCost({deliveryMethodId, profileAddressId: addressId, cartId}: CalculateCostDto): Promise<{ cost: number }> {
    const cart = await this.cartsRepository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.product', 'product')
      .leftJoinAndSelect('product.productDimensions', 'productDimensions')
      .where('cart.id = :cartId', { cartId })
      .getOne();

    if (!cart) {
      throw new CartNotFoundException();
    }

    const deliveryMethod = await this.deliveryMethodsRepository.findOne({
      select: ['id', 'deliveryMethodTypeCode'],
      where: { id: deliveryMethodId },
    });

    if (!deliveryMethod) {
      throw new DeliveryMethodNotFoundException();
    }

    const cost = await this.deliveryCostCalculatorResolver.calculateCost({
      deliveryMethodId,
      addressId,
      products: cart.cartItems,
    }, deliveryMethod.deliveryMethodTypeCode);

    return { cost };
  }
}
