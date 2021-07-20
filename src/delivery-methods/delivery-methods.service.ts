import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryMethodTypes } from 'src/delivery-method-types/enums/delivery-methods-types.enum';
import { Location } from 'src/locations/entities/location.entity';
import { Repository } from 'typeorm';
import { CreateDeliveryMethodDto } from './dto/create-delivery-method.dto';
import { DeliveryMethod } from './entities/delivery-method.entity';
import { DeliveryRange } from './entities/delivery-range.entity';
import { DeliveryZoneToDeliveryRange } from './entities/delivery-zone-to-delivery-range.entity';
import { DeliveryZoneToShippingRange } from './entities/delivery-zone-to-shipping-range.entity';
import { DeliveryZone } from './entities/delivery-zone.entity';
import { ShippingRange } from './entities/shipping-range.entity';

@Injectable()
export class DeliveryMethodsService {
  constructor(
    @InjectRepository(DeliveryMethod) private readonly deliveryMethodsRepository: Repository<DeliveryMethod>,
    @InjectRepository(Location) private readonly locationsRepository: Repository<Location>,
    @InjectRepository(DeliveryZoneToShippingRange) private readonly deliveryZoneToShippingRangesRepository: Repository<DeliveryZoneToShippingRange>,
    @InjectRepository(DeliveryZoneToDeliveryRange) private readonly deliveryZoneToDeliveryRangesRepository: Repository<DeliveryZoneToDeliveryRange>
  ) {}

  async create({deliveryZoneToRanges, shippingZoneToRanges, ...createDeliveryMethodDto}: CreateDeliveryMethodDto): Promise<DeliveryMethod> {
    let deliveryMethod = DeliveryMethod.create(createDeliveryMethodDto);

    switch(createDeliveryMethodDto.deliveryMethodTypeCode) {
      case DeliveryMethodTypes.FREE: {
        deliveryMethod = await this.deliveryMethodsRepository.save(deliveryMethod);
        break;
      }
      case DeliveryMethodTypes.SHIPPING: {
        // Guardar las zonas
        deliveryMethod.deliveryZones = await Promise.all(shippingZoneToRanges.map(async ({ deliveryZone }) => DeliveryZone.create({
          name: deliveryZone.name,
          extraWeightPrice: deliveryZone.extraWeightPrice,
          locations: await this.locationsRepository.findByIds(deliveryZone.locationIds),
        })));

        const sortedShippingRanges = shippingZoneToRanges[0].shippingRanges.sort((a, b) => a.weightFrom - b.weightFrom);

        // Guardar los rangos de envío
        deliveryMethod.shippingRanges = sortedShippingRanges.map((shippingRange, i) => ShippingRange.create({
          position: i,
          weightFrom: shippingRange.weightFrom,
          weightTo: shippingRange.weightTo,
          volumeFrom: shippingRange.volumeFrom,
          volumeTo: shippingRange.volumeTo,
        }));

        deliveryMethod = await this.deliveryMethodsRepository.save(deliveryMethod);

        const deliveryZonePrices = shippingZoneToRanges.reduce((result, shippingZoneToRange) => Object.assign(result, {
          [shippingZoneToRange.deliveryZone.name]: shippingZoneToRange.shippingRanges.map(shippingRange => shippingRange.price),
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
          extraWeightPrice: deliveryZone.extraWeightPrice,
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

        const deliveryZonePrices = deliveryZoneToRanges.reduce((result, deliveryZoneToRange) => Object.assign(result, {
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
}
