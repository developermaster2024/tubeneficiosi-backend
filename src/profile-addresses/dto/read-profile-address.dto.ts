import { Exclude, Expose } from "class-transformer";

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
  readonly latitude: number;

  @Expose()
  readonly longitude: number;

}
