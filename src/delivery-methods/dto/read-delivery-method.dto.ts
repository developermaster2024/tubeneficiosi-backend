import { Exclude, Expose } from "class-transformer";
import { DeliveryMethodType } from "src/delivery-method-types/entities/delivery-method-type.entity";

@Exclude()
export class ReadDeliveryMethodDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly deliveryMethodType: DeliveryMethodType;
}
