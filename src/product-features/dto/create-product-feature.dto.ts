import { Exclude, Expose } from "class-transformer";
import { MaxLength } from "class-validator";

@Exclude()
export class CreateProductFeatureDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @MaxLength(255)
  readonly name: string;
}
