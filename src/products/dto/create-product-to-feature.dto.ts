import { Exclude, Expose, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, MaxLength, Min } from "class-validator";

@Exclude()
export class CreateProductToProductFeatureDto {
  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly value: string;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly price: number;
}
