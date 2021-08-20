import { Exclude, Expose, Transform, Type } from "class-transformer";
import { format } from "date-fns";
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
  readonly subTotal: number;

  @Expose()
  @Type(() => ReadCartItemDto)
  readonly cartItems: ReadCartItemDto[];

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly createdAt: string;
}
