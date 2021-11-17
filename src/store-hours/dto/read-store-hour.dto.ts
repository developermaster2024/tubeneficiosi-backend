import { Exclude, Expose, Transform } from "class-transformer";
import { format, parse } from "date-fns";
import { Days } from "src/support/types/days.enum";

@Exclude()
export class ReadStoreHourDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly isWorkingDay: boolean;

  @Expose()
  readonly day: Days;

  @Expose()
  @Transform(({value}) => format(
    value instanceof Date
      ? value
      : parse(value, 'HH:mm:ss', new Date()),
    'HH:mm:ss'
  ))
  readonly startTime: Date;

  @Expose()
  @Transform(({value}) => format(value instanceof Date
    ? value
    : parse(value, 'HH:mm:ss', new Date())
  ,'HH:mm:ss'))
  readonly endTime: Date;

  @Expose()
  readonly isActive: boolean;

  @Expose()
  readonly dayInSpanish: string;
}
