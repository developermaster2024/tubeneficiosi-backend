import { Exclude, Expose, Transform } from "class-transformer";
import { format } from "date-fns";

@Exclude()
export class ReadAdDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly imagePath: string;

  @Expose()
  readonly title: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly url: string;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly from: Date;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly until: Date;

  @Expose()
  readonly price: number;

  @Expose()
  readonly storeId: number;

  @Expose()
  readonly adsPositionId: number;
}
