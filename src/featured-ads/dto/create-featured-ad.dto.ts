import { Exclude, Expose, Type } from "class-transformer";
import { IsDate, IsNumber, Min } from "class-validator";
import { Product } from "src/products/entities/product.entity";
import { StoreCategory } from "src/store-categories/entities/store-category.entity";
import { DateAfterField } from "src/validation/date-after-field.constrain";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class CreateFeaturedAdDto {
  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly priority: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly price: number;

  @Expose()
  @Type(() => Date)
  @IsDate()
  readonly from: Date;

  @Expose()
  @Type(() => Date)
  @IsDate()
  @DateAfterField('from')
  readonly until: Date;

  @Expose()
  @Exists(StoreCategory)
  readonly storeCategoryId: number;

  @Expose()
  @Exists(Product)
  readonly productId: number;
}
