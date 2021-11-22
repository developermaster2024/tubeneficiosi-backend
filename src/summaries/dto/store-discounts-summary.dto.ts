import { Exclude, Expose, Type } from "class-transformer";
import { ReadDiscountDto } from "src/discounts/dto/read-discount.dto";

@Exclude()
export class StoreDiscountsSummary {
  @Expose()
  @Type(() => ReadDiscountDto)
  readonly bestDiscount: ReadDiscountDto;

  @Expose()
  readonly ordersCount: number;
}
