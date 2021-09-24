import { Exclude, Expose, Type } from "class-transformer";
import { IsDate, IsInt, IsNumber, IsUrl, Max, Min } from "class-validator";
import { Store } from "src/stores/entities/store.entity";
import { DateAfterField } from "src/validation/date-after-field.constrain";
import { Exists } from "src/validation/exists.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class CreateMainBannerAdDto {
  @Expose()
  @IsUrl()
  readonly url: string;

  @Expose()
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly image: Express.Multer.File;

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
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  readonly percentage: number;
}
