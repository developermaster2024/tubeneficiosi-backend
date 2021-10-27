import { Exclude, Expose, Type } from "class-transformer";
import { ReadBrandDto } from "src/brands/dto/read-brand.dto";

@Exclude()
export class ReadProductDetailsDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly reference: string;

  @Expose()
  readonly shortDescription: string;

  @Expose()
  readonly quantity: number;

  @Expose()
  readonly price: number;

  @Expose()
  @Type(() => ReadBrandDto)
  readonly brand: ReadBrandDto;
}
