import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class ReadProfileAddressDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly zipCode: string;

  @Expose()
  readonly address: string;

  @Expose()
  @Type(() => Number)
  readonly latitude: number;

  @Expose()
  @Type(() => Number)
  readonly longitude: number;

}
