import { Injectable } from "@nestjs/common";
import { DeliveryMethodTypes } from "src/delivery-method-types/enums/delivery-methods-types.enum";
import { CalculateCostParams } from "./calculate-cost-params";
import { DeliveryCostCalculator } from "./delivery-cost-calculator";
import { ShippingCostCalculator } from "./shipping-cost-calculator";

@Injectable()
export class DeliveryCostCalculatorResolver {
  constructor(
    private readonly shippingCostCalculator: ShippingCostCalculator,
    private readonly deliveryCostCalculator: DeliveryCostCalculator
  ) {}

  async calculateCost(calculateCostParams: CalculateCostParams, deliveryMethodTypeCode: DeliveryMethodTypes): Promise<number> {
    const calculator = deliveryMethodTypeCode === DeliveryMethodTypes.SHIPPING
      ? this.shippingCostCalculator
      : this.deliveryCostCalculator;

    return await calculator.calculateCost(calculateCostParams);
  }
}
