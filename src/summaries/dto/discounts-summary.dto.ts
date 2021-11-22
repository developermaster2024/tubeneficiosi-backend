import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { ReadDiscountDto } from "src/discounts/dto/read-discount.dto";
import { ReadStoreDto } from "src/stores/dto/read-store.dto";
import { User } from "src/users/entities/user.entity";

@Exclude()
export class DiscountsSummaryDto {
  @Expose()
  readonly discountsCount: number;

  @Expose()
  @Type(() => ReadDiscountDto)
  readonly bestDiscount: ReadDiscountDto;

  @Expose()
  @Transform(({obj}) => obj.storeWithMoreDiscounts ? plainToClass(ReadStoreDto, User.create({store: obj.storeWithMoreDiscounts})) : null)
  readonly storeWithMoreDiscounts: ReadStoreDto;
}
