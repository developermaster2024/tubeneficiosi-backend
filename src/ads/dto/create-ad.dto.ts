import { Exclude, Expose, Type } from "class-transformer";
import { IsDate, IsInt, IsNumber, IsUrl, Max, MaxLength, Min } from "class-validator";
import { AdsPosition } from "src/ads-positions/entities/ads-position.entity";
import { Store } from "src/stores/entities/store.entity";
import { DateAfterField } from "src/validation/date-after-field.constrain";
import { Exists } from "src/validation/exists.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class CreateAdDto {
  @Expose()
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly image: Express.Multer.File;

  @Expose()
  @MaxLength(255)
  readonly title: string;

  @Expose()
  @MaxLength(255)
  readonly description: string;

  @Expose()
  @IsUrl()
  readonly url: string;

  @Expose()
  @Type(() => Date)
  @IsDate()
  readonly from: Date;

  @Expose()
  @Type(() => Date)
  @IsDate()
  @DateAfterField('from')
  readonly until: Date;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly priority: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly price: number;

  @Expose()
  @Exists(Store)
  readonly storeId: number;

  @Expose()
  @Exists(AdsPosition)
  readonly adsPositionId: number;

  @Expose()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  readonly percentage: number;
}
