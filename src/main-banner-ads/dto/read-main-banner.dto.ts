import { Exclude, Expose, Transform } from "class-transformer";
import { format } from "date-fns";

@Exclude()
export class ReadMainBannerAdDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly url: string;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly from: string;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly until: string;

  @Expose()
  readonly priority: number;

  @Expose()
  readonly price: number;

  @Expose()
  readonly imgPath: string;
}
