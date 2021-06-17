import { Exclude, Expose } from "class-transformer";
import { MaxLength } from "class-validator";

@Exclude()
export class AnswerQuestionDto {
  @Expose()
  readonly id: number;

  @Expose()
  @MaxLength(255)
  readonly answer: string;

  @Expose()
  // @Exists(Product)
  readonly productId: number;
}
