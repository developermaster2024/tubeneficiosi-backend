import { Exclude, Expose, Transform, Type } from "class-transformer";
import { format } from "date-fns";
import { ReadClientDto } from "src/clients/dto/read-client.dto";
import { ReadProductDto } from "src/products/dto/read-product.dto";

@Exclude()
export class ReadQuestionDto {
  @Expose()
  readonly id: number;

  @Expose()
  @Type(() => ReadProductDto)
  readonly product: ReadProductDto;

  @Expose()
  readonly question: string;

  @Expose()
  @Type(() => ReadClientDto)
  readonly askedBy: ReadClientDto;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly createdAt: string;

  @Expose()
  readonly answer: string;

  @Expose()
  @Transform(({value}) => value ? format(value, 'yyyy-MM-dd HH:mm:ss') : value)
  readonly answeredAt: string;
}
