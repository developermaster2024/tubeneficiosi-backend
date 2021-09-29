import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class DeleteDeliveryRangeDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly deliveryRangeId: number;
}
