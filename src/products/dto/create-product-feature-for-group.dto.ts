import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber, MaxLength, Min } from "class-validator";

@Exclude()
export class CreateProductFeatureForGroup {
  @Expose()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @MaxLength(255)
  readonly value: string;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly price: number;

  @Expose()
  @Transform(({value}) => value === 'on')
  @IsBoolean()
  readonly isSelectable: boolean;
}
