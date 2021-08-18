import { Exclude, Expose } from "class-transformer";

@Exclude()
export class CalculateCostDto {
  @Expose()
  readonly deliveryMethodId: number;

  @Expose()
  readonly cartId: number;

  @Expose()
  readonly profileAddressId: number;
}
