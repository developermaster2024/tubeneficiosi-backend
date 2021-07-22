import { Exclude, Expose, Type } from "class-transformer";
import { MaxLength, Min } from "class-validator";

@Exclude()
export class CreateDeliveryZoneDto {
  @Expose()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  readonly locationIds: number[];

  @Expose()
  @Type(() => Number)
  @Min(0)
  readonly extraPrice: number;
}
