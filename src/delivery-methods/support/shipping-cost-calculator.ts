import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeliveryZone } from "../entities/delivery-zone.entity";
import { ShippingRange } from "../entities/shipping-range.entity";
import { DeliveryZoneNotFoundException } from "../errors/delivery-zone-not-found.exception";
import { ShippingRangeNotFoundException } from "../errors/shipping-range-not-found.exception";
import { RangeAndZoneCombinationNotFoundException } from "../errors/zone-and-range-combination-not-found.exception";
import { CalculateCostParams } from "./calculate-cost-params";

@Injectable()
export class ShippingCostCalculator {
  constructor(
    @InjectRepository(ShippingRange) private readonly shippingRangesRepository: Repository<ShippingRange>,
    @InjectRepository(DeliveryZone) private readonly deliveryZonesRepository: Repository<DeliveryZone>
  ) {}

  async calculateCost({ addressId, deliveryMethodId, products }: CalculateCostParams): Promise<number> {
    const shippingRanges = await this.shippingRangesRepository.createQueryBuilder('shippingRange')
      .orderBy('shippingRange.position', 'ASC')
      .where('shippingRange.deliveryMethodId = :deliveryMethodId', { deliveryMethodId })
      .getMany();

    const lastRange = shippingRanges[shippingRanges.length - 1];

    if (!lastRange) {
      throw new ShippingRangeNotFoundException();
    }

    const zone = await this.deliveryZonesRepository.createQueryBuilder('deliveryZone')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToShippingRanges', 'deliveryZoneToShippingRange')
      .innerJoin('deliveryZone.locations', 'location', `ST_CONTAINS(location.area, (
        SELECT
          POINT(address.latitude, address.longitude)
        FROM
          client_addresses address
        WHERE
          address.id = :addressId AND address.deleted_at IS NULL
        LIMIT 1
      ))`, {  addressId })
      .andWhere('deliveryMethod.id = :deliveryMethodId', { deliveryMethodId })
      .where('deliveryZone.deliveryMethodId = :deliveryMethodId', { deliveryMethodId })
      .orderBy('location.createdAt', 'DESC')
      .getOne();

    if (!zone) {
      throw new DeliveryZoneNotFoundException();
    }

    return products.reduce((total, { product: { productDimensions: { width, height, length, weight }, ...product }, quantity }) => {
      const weightResult = {
        product,
        range: lastRange,
        addExtraPrice: true,
      };

      const volumeResult = {
        product,
        range: lastRange,
        addExtraPrice: true,
      };

      const volume = width * height * length;

      shippingRanges.forEach((range) => {
        const isInWeightRange = weight >= range.weightFrom && weight <= range.weightTo;

        if (isInWeightRange) {
          weightResult.range = range;
          weightResult.addExtraPrice = false;
        }

        const isInVolumeRange = volume >= range.volumeFrom && volume <= range.volumeTo;

        if (isInVolumeRange) {
          volumeResult.range = range;
          volumeResult.addExtraPrice = false;
        }
      });

      const finalResult = weightResult.range.position >= volumeResult.range.position ? weightResult : volumeResult;

      const zoneToRange = zone.deliveryZoneToShippingRanges.find((dztsr) => dztsr.shippingRangeId === finalResult.range.id);

      if (!zoneToRange) {
        throw new RangeAndZoneCombinationNotFoundException();
      }

      const extraWeight = weight - lastRange.weightTo;

      const extraPrice = finalResult.addExtraPrice && extraWeight > 0
        ? extraWeight * zone.extraPrice
        : 0;

      return total + ((Number(zoneToRange.price) + extraPrice) * quantity);
    }, 0);
  }
}
