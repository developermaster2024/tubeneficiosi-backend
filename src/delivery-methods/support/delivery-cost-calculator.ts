import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeliveryRange } from "../entities/delivery-range.entity";
import { DeliveryZone } from "../entities/delivery-zone.entity";
import { DeliveryRangeNotFoundException } from "../errors/delivery-range-not-found.exception";
import { DeliveryZoneNotFoundException } from "../errors/delivery-zone-not-found.exception";
import { RangeAndZoneCombinationNotFoundException } from "../errors/zone-and-range-combination-not-found.exception";
import { CalculateCostParams } from "./calculate-cost-params";

@Injectable()
export class DeliveryCostCalculator {
  constructor(
    @InjectRepository(DeliveryRange) private readonly deliveryRangesRepositor: Repository<DeliveryRange>,
    @InjectRepository(DeliveryZone) private readonly deliveryZonesRepository: Repository<DeliveryZone>
  ) {}

  async calculateCost({ addressId, deliveryMethodId, products }: CalculateCostParams): Promise<number> {
    const deliveryRanges = await this.deliveryRangesRepositor.createQueryBuilder('deliveryRange')
      .orderBy('deliveryRange.position', 'ASC')
      .where('deliveryRange.deliveryMethodId = :deliveryMethodId', { deliveryMethodId })
      .getMany();

    const lastRange = deliveryRanges[deliveryRanges.length - 1];

    if (!lastRange) {
      throw new DeliveryRangeNotFoundException();
    }


    const zone = await this.deliveryZonesRepository.createQueryBuilder('deliveryZone')
      .leftJoinAndSelect('deliveryZone.deliveryZoneToDeliveryRanges', 'deliveryZoneToDeliveryRange')
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

    const numberOfProducts = products.reduce((total, cartItem) => total + cartItem.quantity, 0);

    const finalResult = {
      range: lastRange,
      addExtraPrice: true,
    };

    deliveryRanges.forEach((range) => {
      const isInRange = numberOfProducts >= range.minProducts && numberOfProducts <= range.maxProducts;

      if (isInRange) {
        finalResult.range = range;
        finalResult.addExtraPrice = false;
      }
    });

    const zoneToRange = zone.deliveryZoneToDeliveryRanges.find((dztdr) => dztdr.deliveryRangeId === finalResult.range.id);

    if (!zoneToRange) {
      throw new RangeAndZoneCombinationNotFoundException();
    }

    const numberOfExtraProducts = numberOfProducts - lastRange.maxProducts;

    const extraPrice = finalResult.addExtraPrice && numberOfExtraProducts > 0
      ? numberOfExtraProducts * zone.extraPrice
      : 0;

    return Number(zoneToRange.price) + Number(extraPrice);
  }
}
