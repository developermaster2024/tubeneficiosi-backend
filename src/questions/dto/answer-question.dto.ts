import { Exclude, Expose, Type } from "class-transformer";
import { MaxLength } from "class-validator";

@Exclude()
export class AnswerQuestionDto {
  @Expose()
  @Type(() => Number)
  readonly id: number;

  @Expose()
  readonly answeredById: number;

  @Expose()
  @MaxLength(255)
  readonly answer: string;
}
