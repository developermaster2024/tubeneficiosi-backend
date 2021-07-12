import { Exclude, Expose, Type } from "class-transformer";
import { IsNumber, Min } from "class-validator";
import { Product } from "src/products/entities/product.entity";
import { Store } from "src/stores/entities/store.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class AddToCartDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Exists(Store)
  readonly storeId: number;

  @Expose()
  @Exists(Product, 'id', (value, obj: AddToCartDto) => ({
    where: {id: value, storeId: obj.storeId}
  }))
  readonly productId: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly quantity: number;
}
