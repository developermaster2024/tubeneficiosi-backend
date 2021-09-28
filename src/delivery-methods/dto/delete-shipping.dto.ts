import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class DeleteShippingRangeDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly shippingRangeId: number;
}
