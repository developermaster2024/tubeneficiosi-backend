import { Exclude, Expose, Transform } from "class-transformer";
import { format } from "date-fns";

@Exclude()
export class ReadStoreAdDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly price: number;

  @Expose()
  readonly priority: number;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly from: string;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly until: string;
}
