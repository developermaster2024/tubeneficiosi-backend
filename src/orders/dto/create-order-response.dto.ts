import { Exclude, Expose, Type } from "class-transformer";
import { ReadOrderDto } from "./read-order.dto";

@Exclude()
export class CreateOrderResponseDto {
  @Expose()
  @Type(() => ReadOrderDto)
  readonly order: ReadOrderDto;

  @Expose()
  readonly url: string;
}
