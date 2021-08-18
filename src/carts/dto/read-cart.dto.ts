import { Exclude, Expose, Type } from "class-transformer";
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
}
