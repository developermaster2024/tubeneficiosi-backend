import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadCountryDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly code: string;

  @Expose()
  readonly dialCode: string;

  @Expose()
  readonly imgPath: string;
}
