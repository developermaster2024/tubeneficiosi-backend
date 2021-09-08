import { Exclude, Expose, Type } from "class-transformer";
import { Store } from "src/stores/entities/store.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class UpdateCartDiscountDto {
  @Expose()
  @Type(() => Number)
  readonly id: number;

  @Expose()
  readonly userId: number;

  @Expose()
  @Exists(Store)
  readonly storeId: number;

  @Expose()
  readonly discountId: number;
}
