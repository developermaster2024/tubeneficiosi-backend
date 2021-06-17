import { Exclude, Expose } from "class-transformer";
import { MaxLength } from "class-validator";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class CreateQuestionDto {
  @Expose()
  userId: number;

  @Expose()
  @MaxLength(255)
  readonly question: string;

  @Expose()
  // @Exists(Product)
  readonly productId: number;
}
