import { Exclude, Expose, Type } from "class-transformer";
import { IsDate, IsNumber, Min } from "class-validator";
import { Store } from "src/stores/entities/store.entity";
import { DateAfterField } from "src/validation/date-after-field.constrain";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class CreateStoreAdDto {
  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly price: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly priority: number;

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
  @Exists(Store)
  readonly storeId: number;
}
