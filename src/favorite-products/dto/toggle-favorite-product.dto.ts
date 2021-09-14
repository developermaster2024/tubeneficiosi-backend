import { Exclude, Expose } from "class-transformer";
import { Product } from "src/products/entities/product.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class ToggleFavoriteProductDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Exists(Product)
  readonly productId: number;
}
