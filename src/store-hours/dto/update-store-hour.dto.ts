import { Exclude, Expose, Transform } from "class-transformer";
import { IsBoolean, IsDate } from "class-validator";
import { parse } from "date-fns";
import { Days } from "src/support/types/days.enum";
import { DateAfterField } from "src/validation/date-after-field.constrain";

@Exclude()
export class UpdateStoreHourDto {
  @Expose()
  readonly userId: number;

  @Expose()
  readonly day: Days;

  @Expose()
  @Transform(({value}) => parse(value, 'HH:mm:ss', new Date()))
  @IsDate()
  readonly startTime: Date;

  @Expose()
  @Transform(({value}) => parse(value, 'HH:mm:ss', new Date()))
  @IsDate()
  @DateAfterField('startTime')
  readonly endTime: Date;

  @Expose()
  @IsBoolean()
  readonly isWorkingDay: boolean;
}
