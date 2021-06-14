import { Exclude, Expose, Type } from "class-transformer";
import { IsString, Max, MaxLength, Min } from "class-validator";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class UpdatePageInfoDto {
  @Expose()
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly logo: Express.Multer.File;

  @Expose()
  @IsString()
  @MaxLength(30)
  readonly name: string;

  @Expose()
  @IsString()
  @MaxLength(500)
  readonly description: string;

  @Expose()
  @IsString()
  @MaxLength(150)
  readonly copyrightText: string;

  @Expose()
  @Type(() => Number)
  @Min(0)
  @Max(99)
  readonly commissionForSale: number;
}
