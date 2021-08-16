import { Exclude, Expose, Type } from "class-transformer";
import { Min } from "class-validator";

@Exclude()
export class UpdateCartItemQuantityDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly cartId: number;

  @Expose()
  @Type(() => Number)
  readonly cartItemId: number;

  @Expose()
  @Type(() => Number)
  @Min(1)
  readonly quantity: number;
}
