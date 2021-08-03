import { Exclude, Expose } from "class-transformer";
import { MaxLength } from "class-validator";
import { Product } from "src/products/entities/product.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class CreateQuestionDto {
  @Expose()
  answeredById: number;

  @Expose()
  @MaxLength(255)
  readonly question: string;

  @Expose()
  @Exists(Product)
  readonly productId: number;
}
