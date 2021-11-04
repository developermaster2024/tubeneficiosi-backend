import { Exclude, Expose, Type } from "class-transformer";
import { ReadProductDto } from "src/products/dto/read-product.dto";
import { CartItemFeature } from "../entities/cart-item-feature.entity";
import { ReadCartItemShowDetailsDto } from "./read-cart-item-show-details.dto";

@Exclude()
export class ReadCartItemDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly quantity: number;

  @Expose()
  readonly total: number;

  @Expose()
  readonly productId: number;

  @Expose()
  readonly productName: string;

  @Expose()
  readonly productImage: string;

  @Expose()
  readonly productSlug: string;

  @Expose()
  readonly productPrice: number;

  @Expose()
  readonly cartItemFeatures: CartItemFeature[];

  @Expose()
  @Type(() => ReadCartItemShowDetailsDto)
  readonly cartItemShowDetails: ReadCartItemShowDetailsDto;
}
