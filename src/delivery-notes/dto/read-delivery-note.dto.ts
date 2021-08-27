import { Exclude, Expose, Transform, Type } from "class-transformer";
import { format } from "date-fns";
import { ReadOrderDto } from "src/orders/dto/read-order.dto";

@Exclude()
export class ReadDeliveryNoteDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly trackingNumber: string;

  @Expose()
  readonly url: string;

  @Expose()
  @Type(() => ReadOrderDto)
  readonly order: ReadOrderDto;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly createdAt: string;
}
