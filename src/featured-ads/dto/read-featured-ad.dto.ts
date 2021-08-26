import { Exclude, Expose, Transform, Type } from "class-transformer";
import { format } from "date-fns";
import { ReadProductDto } from "src/products/dto/read-product.dto";
import { ReadStoreCategoryDto } from "src/store-categories/dto/read-store-categories.dto";

@Exclude()
export class ReadFeaturedAdDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly priority: number;

  @Expose()
  readonly price: number;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly from: Date;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly until: Date;

  @Expose()
  @Type(() => ReadProductDto)
  readonly product: ReadProductDto;

  @Expose()
  @Type(() => ReadStoreCategoryDto)
  readonly storeCategory: ReadStoreCategoryDto;

  @Expose()
  readonly isActive: boolean;
}
