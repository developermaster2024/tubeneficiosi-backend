import { Exclude, Expose } from "class-transformer";
import { IsNumber, Max, MaxLength, Min, MinLength } from "class-validator";

@Exclude()
export class CreateProfileAddressDto {
  @Expose()
  readonly user: number;

  @Expose()
  @MinLength(2)
  @MaxLength(150)
  readonly name: string;

  @Expose()
  @MinLength(2)
  @MaxLength(50)
  readonly zipCode: string;

  @Expose()
  @MinLength(2)
  @MaxLength(255)
  readonly address: string;

  @Expose()
  @IsNumber()
  @Min(-90)
  @Max(90)
  readonly latitude: number;

  @Expose()
  @IsNumber()
  @Min(-180)
  @Max(180)
  readonly longitude: number;
}
