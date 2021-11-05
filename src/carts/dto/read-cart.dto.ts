import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { format } from "date-fns";
import { ReadClientDto } from "src/clients/dto/read-client.dto";
import { ReadDiscountDto } from "src/discounts/dto/read-discount.dto";
import { ReadOrderDto } from "src/orders/dto/read-order.dto";
import { ReadStoreDto } from "src/stores/dto/read-store.dto";
import { User } from "src/users/entities/user.entity";
import { ReadCartItemDto } from "./read-cart-item.dto";

@Exclude()
export class ReadCartDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly isProcessed: boolean;

  @Expose()
  readonly isDirectPurchase: boolean;

  @Expose()
  readonly storeId: number;

  @Expose()
  @Transform(({obj}) => obj.store ? plainToClass(ReadStoreDto, User.create({store: obj.store})) : null)
  readonly store: ReadStoreDto;

  @Expose()
  @Type(() => Number)
  readonly subTotal: number;

  @Expose()
  @Type(() => Number)
  readonly subTotalWithDiscount: number;

  @Expose()
  @Type(() => ReadCartItemDto)
  readonly cartItems: ReadCartItemDto[];

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly expiresOn: string;

  @Expose()
  readonly isExpired: boolean;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly createdAt: string;

  @Expose()
  @Type(() => ReadClientDto)
  readonly user: ReadClientDto;

  @Expose()
  @Type(() => ReadOrderDto)
  readonly order: ReadOrderDto;

  @Expose()
  @Type(() => ReadDiscountDto)
  readonly discount: ReadDiscountDto;
}
