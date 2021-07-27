import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, MaxLength } from "class-validator";

@Exclude()
export class CreateCardTypeDto {
  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;
}
