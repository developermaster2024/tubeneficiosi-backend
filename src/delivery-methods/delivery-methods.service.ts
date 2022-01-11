import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryMethodTypes } from 'src/delivery-method-types/enums/delivery-methods-types.enum';
import { Location } from 'src/locations/entities/location.entity';
import { Store } from 'src/stores/entities/store.entity';
import { StoreNotFoundException } from 'src/stores/erros/store-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { In, Repository } from 'typeorm';
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
import { UpdateShippingRangeDto } from './dto/update-shipping-range.dto';
import { ShippingRangeNotFoundException } from './errors/shipping-range-not-found.exception';
import { DeleteShippingRangeDto } from './dto/delete-shipping-range.dto';
import { RangeIsBetweenExistingRangesException } from './errors/range-is-between-existing-ranges.exception';
import { UpdateZoneToShippingRangeDto } from './dto/update-zone-to-shipping-range.dto';
import { DeliveryZoneToShippingRangeNotFoundException } from './errors/delivery-zone-to-shipping-range-not-found.exception';
import { UpdateDeliveryZoneDto } from './dto/update-delivery-zone.dto';
import { DeliveryZoneNotFoundException } from './errors/delivery-zone-not-found.exception';
import { UpdateDeliveryRangeDto } from './dto/update-delivery-range.dto';
import { DeliveryRangeNotFoundException } from './errors/delivery-range-not-found.exception';
import { DeleteDeliveryRangeDto } from './dto/delete-delivery-range.dto';
import { DeleteDeliveryZoneDto } from './dto/delete-delivery-zone.dto';
import { UpdateZoneToDeliveryRangeDto } from './dto/update-zone-to-delivery-range.dto';
import { DeliveryZoneToDeliveryRangeNotFoundException } from './dto/delivery-zone-to-delivery-range-not-found.exception';
import { AddShippingRangeDto } from './dto/add-shipping-range.dto';
import { AddDeliveryRangeDto } from './dto/add-delivery-range.dto';
import { AddDeliveryZoneDto } from './dto/add-delivery-zone.dto';

const shippingRangeIsBetweenRanges = ({weightFrom, weightTo, volumeFrom, volumeTo}: ShippingRange, ranges: ShippingRange[]) => {
  for (const range of ranges) {
    const weightFromIsBetweenRanges = weightFrom >= range.weightFrom && weightFrom <= range.weightTo;
    const weightToIsBetweenRanges = weightTo >= range.weightFrom && weightTo <= range.weightTo;
    const volumeFromIsBetweenRanges = volumeFrom >= range.volumeFrom && volumeFrom <= range.volumeTo;
    const volumeToIsBetweenRanges = volumeTo >= range.volumeFrom && volumeTo <= range.volumeTo;

    if (weightFromIsBetweenRanges || weightToIsBetweenRanges || volumeFromIsBetweenRanges || volumeToIsBetweenRanges) {
      return true;
    }
  }

  return false;
}

const deliveryRangeIsBetweenRanges = ({minProducts, maxProducts}: DeliveryRange, ranges: DeliveryRange[]) => {
  for (const range of ranges) {
    const minProductsIsBetweenRanges = minProducts >= range.minProducts && minProducts <= range.maxProducts;
    const maxProductsIsBetweenRanges = maxProducts >= range.minProducts && maxProducts <= range.maxProducts;

    if (minProductsIsBetweenRanges || maxProductsIsBetweenRanges) {
      return true;
    }
  }

  return false;
}

@Injectable()
export class DeliveryMethodsService {
  constructor(
    @InjectRepository(DeliveryMethod) private readonly deliveryMethodsRepository: Repository<DeliveryMethod>,
    @InjectRepository(Location) private readonly locationsRepository: Repository<Location>,
    @InjectRepository(DeliveryZoneToShippingRange) private readonly deliveryZoneToShippingRangesRepository: Repository<DeliveryZoneToShippingRange>,
    @InjectRepository(DeliveryZoneToDeliveryRange) private readonly deliveryZoneToDeliveryRangesRepository: Repository<DeliveryZoneToDeliveryRange>,
    @InjectRepository(Store) private readonly storesRepository: Repository<Store>,
    @InjectRepository(Cart) private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(ShippingRange) private readonly shippingRangesRepository: Repository<ShippingRange>,
    @InjectRepository(DeliveryRange) private readonly deliveryRangesRepository: Repository<DeliveryRange>,
    @InjectRepository(DeliveryZone) private readonly deliveryZonesRepository: Repository<DeliveryZone>,
    private readonly deliveryCostCalculatorResolver: DeliveryCostCalculatorResolver
  ) {}

  async paginate({perPage, offset, filters: {
    id,
    deliveryMethodTypeCode,
    name,
    storeId,
    addressId,
    forCartId,
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

    if (addressId && forCartId) {
      for (let deliveryMethod of deliveryMethods) {
        deliveryMethod.deliveryCost = (await this.calculateCost({
          deliveryMethodId: deliveryMethod.id,
          cartId: forCartId,
          profileAddressId: addressId,
        })).cost;
      }
    }

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
    const deliveryMethod = await this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .innerJoinAndSelect('deliveryMethod.deliveryMethodType', 'deliveryMethodType')
      .leftJoinAndSelect('deliveryMethod.deliveryZones', 'deliveryZone')
      .leftJoinAndSelect('deliveryZone.locations', 'location')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToDeliveryRanges', 'deliveryZoneToDeliveryRange')
      .leftJoinAndSelect('deliveryZoneToDeliveryRange.deliveryRange', 'dztdrDeliveryRange')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToShippingRanges', 'deliveryZoneToShippingRange')
      .leftJoinAndSelect('deliveryZoneToShippingRange.shippingRange', 'dztsrShippingRange')
      .where('deliveryMethod.id = :id', { id })
      .getOne();

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

  async addShippingRange({userId, deliveryMethodId, price, ...addShippingRangeDto}: AddShippingRangeDto): Promise<DeliveryMethod> {
    const deliveryMethod = await this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .leftJoinAndSelect('deliveryMethod.deliveryZones', 'deliveryZone')
      .innerJoin('deliveryMethod.store', 'store')
      .where('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!deliveryMethod) throw new DeliveryMethodNotFoundException();

    const shippingRanges = await this.shippingRangesRepository.createQueryBuilder('shippingRange')
      .where('shippingRange.deliveryMethodId = :deliveryMethodId', { deliveryMethodId: deliveryMethod.id })
      .orderBy('shippingRange.position', 'ASC')
      .getMany();

    const shippingRange = ShippingRange.create({
      ...addShippingRangeDto,
      deliveryMethodId,
      position: shippingRanges.length > 0
        ? shippingRanges[shippingRanges.length - 1].position + 1
        : 0,
    });

    if (shippingRangeIsBetweenRanges(shippingRange, shippingRanges)) {
      throw new RangeIsBetweenExistingRangesException();
    }

    const savedShippingRange = await this.shippingRangesRepository.save(shippingRange);

    const deliveryZoneToShippingRanges = deliveryMethod.deliveryZones.map((deliveryZone) => DeliveryZoneToShippingRange.create({
      deliveryZone,
      shippingRange: savedShippingRange,
      price,
    }));

    await this.deliveryZoneToShippingRangesRepository.save(deliveryZoneToShippingRanges);

    const deliveryMethodWithNewRange = await this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .innerJoinAndSelect('deliveryMethod.deliveryMethodType', 'deliveryMethodType')
      .leftJoinAndSelect('deliveryMethod.deliveryZones', 'deliveryZone')
      .leftJoinAndSelect('deliveryZone.locations', 'location')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToDeliveryRanges', 'deliveryZoneToDeliveryRange')
      .leftJoinAndSelect('deliveryZoneToDeliveryRange.deliveryRange', 'dztdrDeliveryRange')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToShippingRanges', 'deliveryZoneToShippingRange')
      .leftJoinAndSelect('deliveryZoneToShippingRange.shippingRange', 'dztsrShippingRange')
      .where('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId: deliveryMethod.id })
      .getOne();

    if (!deliveryMethodWithNewRange) {
      throw new DeliveryMethodNotFoundException();
    }

    return deliveryMethodWithNewRange;
  }

  async updateShippingRange({userId, shippingRangeId, ...updateShippingRange}: UpdateShippingRangeDto): Promise<DeliveryMethod> {
    const shippingRange = await this.shippingRangesRepository.createQueryBuilder('shippingRange')
      .innerJoinAndSelect('shippingRange.deliveryMethod', 'deliveryMethod')
      .innerJoin('deliveryMethod.store', 'store')
      .where('shippingRange.id = :shippingRangeId', { shippingRangeId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!shippingRange) throw new ShippingRangeNotFoundException();

    Object.assign(shippingRange, updateShippingRange);

    const shippingRanges = await this.shippingRangesRepository.createQueryBuilder('shippingRanges')
      .where('shippingRanges.deliveryMethodId = :deliveryMethodId', { deliveryMethodId: shippingRange.deliveryMethod.id })
      .andWhere('shippingRanges.id <> :id', { id: shippingRange.id })
      .getMany();

    if (shippingRangeIsBetweenRanges(shippingRange, shippingRanges)) {
      throw new RangeIsBetweenExistingRangesException();
    }

    await this.shippingRangesRepository.save(shippingRange);

    const deliveryMethod = await this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .innerJoinAndSelect('deliveryMethod.deliveryMethodType', 'deliveryMethodType')
      .leftJoinAndSelect('deliveryMethod.deliveryZones', 'deliveryZone')
      .leftJoinAndSelect('deliveryZone.locations', 'location')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToDeliveryRanges', 'deliveryZoneToDeliveryRange')
      .leftJoinAndSelect('deliveryZoneToDeliveryRange.deliveryRange', 'dztdrDeliveryRange')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToShippingRanges', 'deliveryZoneToShippingRange')
      .leftJoinAndSelect('deliveryZoneToShippingRange.shippingRange', 'dztsrShippingRange')
      .where('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId: shippingRange.deliveryMethod.id })
      .getOne();

    if (!deliveryMethod) {
      throw new DeliveryMethodNotFoundException();
    }

    return deliveryMethod;
  }

  async deleteShippingRange({userId, shippingRangeId}: DeleteShippingRangeDto): Promise<DeliveryMethod> {
    const shippingRange = await this.shippingRangesRepository.createQueryBuilder('shippingRange')
      .innerJoinAndSelect('shippingRange.deliveryMethod', 'deliveryMethod')
      .innerJoin('deliveryMethod.store', 'store')
      .where('shippingRange.id = :shippingRangeId', { shippingRangeId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!shippingRange) throw new ShippingRangeNotFoundException();

    await this.shippingRangesRepository.remove(shippingRange);

    const deliveryMethod = await this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .innerJoinAndSelect('deliveryMethod.deliveryMethodType', 'deliveryMethodType')
      .leftJoinAndSelect('deliveryMethod.deliveryZones', 'deliveryZone')
      .leftJoinAndSelect('deliveryZone.locations', 'location')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToDeliveryRanges', 'deliveryZoneToDeliveryRange')
      .leftJoinAndSelect('deliveryZoneToDeliveryRange.deliveryRange', 'dztdrDeliveryRange')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToShippingRanges', 'deliveryZoneToShippingRange')
      .leftJoinAndSelect('deliveryZoneToShippingRange.shippingRange', 'dztsrShippingRange')
      .where('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId: shippingRange.deliveryMethod.id })
      .getOne();

    if (!deliveryMethod) {
      throw new DeliveryMethodNotFoundException();
    }

    return deliveryMethod;
  }

  async updateDeliveryRange({deliveryRangeId, userId, ...updateDeliveryRangeDto}: UpdateDeliveryRangeDto): Promise<DeliveryMethod> {
    const deliveryRange = await this.deliveryRangesRepository.createQueryBuilder('deliveryRange')
      .innerJoinAndSelect('deliveryRange.deliveryMethod', 'deliveryMethod')
      .innerJoin('deliveryMethod.store', 'store')
      .where('deliveryRange.id = :deliveryRangeId', { deliveryRangeId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!deliveryRange) throw new DeliveryRangeNotFoundException();

    Object.assign(deliveryRange, updateDeliveryRangeDto);

    const deliveryRanges = await this.deliveryRangesRepository.createQueryBuilder('deliveryRange')
      .where('deliveryRange.deliveryMethodId = :deliveryMethodId', { deliveryMethodId: deliveryRange.deliveryMethod.id })
      .andWhere('deliveryRange.id <> :id', { id: deliveryRangeId })
      .getMany();

    if (deliveryRangeIsBetweenRanges(deliveryRange, deliveryRanges)) {
      throw new RangeIsBetweenExistingRangesException();
    }

    await this.deliveryRangesRepository.save(deliveryRange);

    const deliveryMethod = await this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .innerJoinAndSelect('deliveryMethod.deliveryMethodType', 'deliveryMethodType')
      .leftJoinAndSelect('deliveryMethod.deliveryZones', 'deliveryZone')
      .leftJoinAndSelect('deliveryZone.locations', 'location')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToDeliveryRanges', 'deliveryZoneToDeliveryRange')
      .leftJoinAndSelect('deliveryZoneToDeliveryRange.deliveryRange', 'dztdrDeliveryRange')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToShippingRanges', 'deliveryZoneToShippingRange')
      .leftJoinAndSelect('deliveryZoneToShippingRange.shippingRange', 'dztsrShippingRange')
      .where('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId: deliveryRange.deliveryMethod.id })
      .getOne();

    if (!deliveryMethod) {
      throw new DeliveryMethodNotFoundException();
    }

    return deliveryMethod;
  }

  async deleteDeliveryRange({userId, deliveryRangeId}: DeleteDeliveryRangeDto): Promise<DeliveryMethod> {
    const deliveryRange = await this.deliveryRangesRepository.createQueryBuilder('deliveryRange')
      .innerJoinAndSelect('deliveryRange.deliveryMethod', 'deliveryMethod')
      .innerJoin('deliveryMethod.store', 'store')
      .where('deliveryRange.id = :deliveryRangeId', { deliveryRangeId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!deliveryRange) throw new DeliveryRangeNotFoundException();

    await this.deliveryRangesRepository.remove(deliveryRange);

    const deliveryMethod = await this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .innerJoinAndSelect('deliveryMethod.deliveryMethodType', 'deliveryMethodType')
      .leftJoinAndSelect('deliveryMethod.deliveryZones', 'deliveryZone')
      .leftJoinAndSelect('deliveryZone.locations', 'location')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToDeliveryRanges', 'deliveryZoneToDeliveryRange')
      .leftJoinAndSelect('deliveryZoneToDeliveryRange.deliveryRange', 'dztdrDeliveryRange')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToShippingRanges', 'deliveryZoneToShippingRange')
      .leftJoinAndSelect('deliveryZoneToShippingRange.shippingRange', 'dztsrShippingRange')
      .where('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId: deliveryRange.deliveryMethod.id })
      .getOne();

    if (!deliveryMethod) {
      throw new DeliveryMethodNotFoundException();
    }

    return deliveryMethod;
  }

  async addDeliveryRange({deliveryMethodId, userId, price, ...dddDeliveryRangeDto}: AddDeliveryRangeDto): Promise<DeliveryMethod> {
    const deliveryMethod = await this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .leftJoinAndSelect('deliveryMethod.deliveryZones', 'deliveryZone')
      .innerJoin('deliveryMethod.store', 'store')
      .where('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!deliveryMethod) throw new DeliveryMethodNotFoundException();

    const deliveryRanges = await this.deliveryRangesRepository.createQueryBuilder('deliveryRange')
      .where('deliveryRange.deliveryMethodId = :deliveryMethodId', { deliveryMethodId: deliveryMethod.id })
      .orderBy('deliveryRange.position', 'ASC')
      .getMany();

    const deliveryRange = DeliveryRange.create({
      ...dddDeliveryRangeDto,
      deliveryMethodId,
      position: deliveryRanges.length > 0
        ? deliveryRanges[deliveryRanges.length - 1].position + 1
        : 0,
    });

    if (deliveryRangeIsBetweenRanges(deliveryRange, deliveryRanges)) throw new RangeIsBetweenExistingRangesException();

    const savedDeliveryRange = await this.deliveryRangesRepository.save(deliveryRange);

    const deliveryZoneToDeliveryRanges = deliveryMethod.deliveryZones.map((deliveryZone) => DeliveryZoneToDeliveryRange.create({
      deliveryZone,
      deliveryRange: savedDeliveryRange,
      price,
    }));

    await this.deliveryZoneToDeliveryRangesRepository.save(deliveryZoneToDeliveryRanges);

    const deliveryMethodWithNewRange = await this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .innerJoinAndSelect('deliveryMethod.deliveryMethodType', 'deliveryMethodType')
      .leftJoinAndSelect('deliveryMethod.deliveryZones', 'deliveryZone')
      .leftJoinAndSelect('deliveryZone.locations', 'location')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToDeliveryRanges', 'deliveryZoneToDeliveryRange')
      .leftJoinAndSelect('deliveryZoneToDeliveryRange.deliveryRange', 'dztdrDeliveryRange')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToShippingRanges', 'deliveryZoneToShippingRange')
      .leftJoinAndSelect('deliveryZoneToShippingRange.shippingRange', 'dztsrShippingRange')
      .where('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId: deliveryMethod.id })
      .getOne();

    if (!deliveryMethodWithNewRange) {
      throw new DeliveryMethodNotFoundException();
    }

    return deliveryMethodWithNewRange;
  }

  async updateZoneToShippingRange({zoneToShippingRangeId, userId, ...updateZoneToShippingRangeDto}: UpdateZoneToShippingRangeDto): Promise<DeliveryMethod> {
    const zoneToShippingRange = await this.deliveryZoneToShippingRangesRepository.createQueryBuilder('dztsr')
      .innerJoinAndSelect('dztsr.deliveryZone', 'deliveryZone')
      .innerJoinAndSelect('deliveryZone.deliveryMethod', 'deliveryMethod')
      .innerJoin('deliveryMethod.store', 'store')
      .where('dztsr.id = :zoneToShippingRangeId', { zoneToShippingRangeId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!zoneToShippingRange) throw new DeliveryZoneToShippingRangeNotFoundException();

    Object.assign(zoneToShippingRange, updateZoneToShippingRangeDto);

    await this.deliveryZoneToShippingRangesRepository.save(zoneToShippingRange);

    const deliveryMethod = await this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .innerJoinAndSelect('deliveryMethod.deliveryMethodType', 'deliveryMethodType')
      .leftJoinAndSelect('deliveryMethod.deliveryZones', 'deliveryZone')
      .leftJoinAndSelect('deliveryZone.locations', 'location')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToDeliveryRanges', 'deliveryZoneToDeliveryRange')
      .leftJoinAndSelect('deliveryZoneToDeliveryRange.deliveryRange', 'dztdrDeliveryRange')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToShippingRanges', 'deliveryZoneToShippingRange')
      .leftJoinAndSelect('deliveryZoneToShippingRange.shippingRange', 'dztsrShippingRange')
      .where('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId: zoneToShippingRange.deliveryZone.deliveryMethod.id })
      .getOne();

    if (!deliveryMethod) {
      throw new DeliveryMethodNotFoundException();
    }

    return deliveryMethod;
  }

  async updateZoneToDeliveryRange({zoneToDeliveryRangeId, userId, ...updateZoneToDeliveryRangeDto}: UpdateZoneToDeliveryRangeDto): Promise<DeliveryMethod> {
    const zoneToDeliveryRange = await this.deliveryZoneToDeliveryRangesRepository.createQueryBuilder('dztdr')
      .innerJoinAndSelect('dztdr.deliveryZone', 'deliveryZone')
      .innerJoinAndSelect('deliveryZone.deliveryMethod', 'deliveryMethod')
      .innerJoin('deliveryMethod.store', 'store')
      .where('dztdr.id = :zoneToDeliveryRangeId', { zoneToDeliveryRangeId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!zoneToDeliveryRange) throw new DeliveryZoneToDeliveryRangeNotFoundException();

    Object.assign(zoneToDeliveryRange, updateZoneToDeliveryRangeDto);

    await this.deliveryZoneToDeliveryRangesRepository.save(zoneToDeliveryRange);

    const deliveryMethod = await this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .innerJoinAndSelect('deliveryMethod.deliveryMethodType', 'deliveryMethodType')
      .leftJoinAndSelect('deliveryMethod.deliveryZones', 'deliveryZone')
      .leftJoinAndSelect('deliveryZone.locations', 'location')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToDeliveryRanges', 'deliveryZoneToDeliveryRange')
      .leftJoinAndSelect('deliveryZoneToDeliveryRange.deliveryRange', 'dztdrDeliveryRange')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToShippingRanges', 'deliveryZoneToShippingRange')
      .leftJoinAndSelect('deliveryZoneToShippingRange.shippingRange', 'dztsrShippingRange')
      .where('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId: zoneToDeliveryRange.deliveryZone.deliveryMethod.id })
      .getOne();

    if (!deliveryMethod) {
      throw new DeliveryMethodNotFoundException();
    }

    return deliveryMethod;
  }

  async addDeliveryZone({userId, deliveryMethodId, locationIds, ...addDeliveryZoneDto}: AddDeliveryZoneDto): Promise<DeliveryMethod> {
    const deliveryMethod = await this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .innerJoinAndSelect('deliveryMethod.deliveryMethodType', 'deliveryMethodType')
      .innerJoin('deliveryMethod.store', 'store')
      .where('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!deliveryMethod) throw new DeliveryMethodNotFoundException();

    const deliveryZone = await this.deliveryZonesRepository.save(DeliveryZone.create({
      ...addDeliveryZoneDto,
      deliveryMethod,
      locations: await this.locationsRepository.find({ id: In(locationIds) }),
    }));

    if (deliveryMethod.deliveryMethodType.code === DeliveryMethodTypes.SHIPPING) {
      const shippingRanges = await this.shippingRangesRepository.createQueryBuilder('shippingRange')
        .where('shippingRange.deliveryMethodId = :deliveryMethodId', { deliveryMethodId })
        .getMany();

      const deliveryZonesToShippingRanges = shippingRanges.map((shippingRange) => DeliveryZoneToShippingRange.create({
        deliveryZone,
        shippingRange,
        price: 0,
      }));

      await this.deliveryZoneToShippingRangesRepository.save(deliveryZonesToShippingRanges);
    } else {
      const deliveryRanges = await this.deliveryRangesRepository.createQueryBuilder('deliveryRange')
        .where('deliveryRange.deliveryMethodId = :deliveryMethodId', { deliveryMethodId })
        .getMany();

      const deliveryZoneToDeliveryRanges = deliveryRanges.map((deliveryRange) => DeliveryZoneToDeliveryRange.create({
        deliveryZone,
        deliveryRange,
        price: 0,
      }));

      await this.deliveryZoneToDeliveryRangesRepository.save(deliveryZoneToDeliveryRanges);
    }

    const deliveryMethodWithZone = await this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .innerJoinAndSelect('deliveryMethod.deliveryMethodType', 'deliveryMethodType')
      .leftJoinAndSelect('deliveryMethod.deliveryZones', 'deliveryZone')
      .leftJoinAndSelect('deliveryZone.locations', 'location')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToDeliveryRanges', 'deliveryZoneToDeliveryRange')
      .leftJoinAndSelect('deliveryZoneToDeliveryRange.deliveryRange', 'dztdrDeliveryRange')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToShippingRanges', 'deliveryZoneToShippingRange')
      .leftJoinAndSelect('deliveryZoneToShippingRange.shippingRange', 'dztsrShippingRange')
      .where('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId })
      .getOne();

    if (!deliveryMethodWithZone) {
      throw new DeliveryMethodNotFoundException();
    }

    return deliveryMethodWithZone;
  }

  async updateDeliveryZone({userId, deliveryZoneId, ...updateDeliveryZoneDto}: UpdateDeliveryZoneDto): Promise<DeliveryMethod> {
    const deliveryZone = await this.deliveryZonesRepository.createQueryBuilder('deliveryZone')
      .innerJoinAndSelect('deliveryZone.deliveryMethod', 'deliveryMethod')
      .innerJoin('deliveryMethod.store', 'store')
      .where('deliveryZone.id = :deliveryZoneId', { deliveryZoneId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!deliveryZone) throw new DeliveryZoneNotFoundException();

    Object.assign(deliveryZone, updateDeliveryZoneDto);

    await this.deliveryZonesRepository.save(deliveryZone);

    const deliveryMethod = await this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .innerJoinAndSelect('deliveryMethod.deliveryMethodType', 'deliveryMethodType')
      .leftJoinAndSelect('deliveryMethod.deliveryZones', 'deliveryZone')
      .leftJoinAndSelect('deliveryZone.locations', 'location')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToDeliveryRanges', 'deliveryZoneToDeliveryRange')
      .leftJoinAndSelect('deliveryZoneToDeliveryRange.deliveryRange', 'dztdrDeliveryRange')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToShippingRanges', 'deliveryZoneToShippingRange')
      .leftJoinAndSelect('deliveryZoneToShippingRange.shippingRange', 'dztsrShippingRange')
      .where('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId: deliveryZone.deliveryMethod.id })
      .getOne();

    if (!deliveryMethod) {
      throw new DeliveryMethodNotFoundException();
    }

    return deliveryMethod;
  }

  async deleteDeliveryZone({userId, deliveryZoneId}: DeleteDeliveryZoneDto): Promise<DeliveryMethod> {
    const deliveryZone = await this.deliveryZonesRepository.createQueryBuilder('deliveryZone')
      .innerJoinAndSelect('deliveryZone.deliveryMethod', 'deliveryMethod')
      .innerJoin('deliveryMethod.store', 'store')
      .where('deliveryZone.id = :deliveryZoneId', { deliveryZoneId })
      .andWhere('store.userId = :userId', { userId })
      .getOne();

    if (!deliveryZone) throw new DeliveryZoneNotFoundException();

    const deliveryMethodId = deliveryZone.deliveryMethod.id;

    deliveryZone.deliveryMethod = null;

    await this.deliveryZonesRepository.save(deliveryZone);

    const deliveryMethod = await this.deliveryMethodsRepository.createQueryBuilder('deliveryMethod')
      .innerJoinAndSelect('deliveryMethod.deliveryMethodType', 'deliveryMethodType')
      .leftJoinAndSelect('deliveryMethod.deliveryZones', 'deliveryZone')
      .leftJoinAndSelect('deliveryZone.locations', 'location')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToDeliveryRanges', 'deliveryZoneToDeliveryRange')
      .leftJoinAndSelect('deliveryZoneToDeliveryRange.deliveryRange', 'dztdrDeliveryRange')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToShippingRanges', 'deliveryZoneToShippingRange')
      .leftJoinAndSelect('deliveryZoneToShippingRange.shippingRange', 'dztsrShippingRange')
      .where('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId })
      .getOne();

    if (!deliveryMethod) {
      throw new DeliveryMethodNotFoundException();
    }

    return deliveryMethod;
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
