import { Exclude, Expose, Transform, Type } from "class-transformer";
import { format } from "date-fns";
import { ReadClientDto } from "src/clientes/dto/read-client.dto";

@Exclude()
export class ReadQuestionDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly productId: number;

  @Expose()
  readonly question: string;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly createdAt: string;

  @Expose()
  readonly answer: string;

  @Expose()
  @Transform(({value}) => value ? format(value, 'yyyy-MM-dd HH:mm:ss') : value)
  readonly answeredAt: string;

  @Expose()
  @Type(() => ReadClientDto)
  readonly user: ReadClientDto;
}
