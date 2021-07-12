import { Exclude, Expose, Type } from "class-transformer";
import { ReadProductDto } from "src/products/dto/read-product.dto";

@Exclude()
export class ReadCartItemDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly quantity: number;

  @Expose()
  readonly total: number;

  @Expose()
  @Type(() => ReadProductDto)
  readonly product: ReadProductDto;
}
