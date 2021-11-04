import { Exclude, Expose, Type } from "class-transformer";
import { IsBoolean, IsNumber, Min, ValidateNested } from "class-validator";
import { Product } from "src/products/entities/product.entity";
import { StoreCategoriesWithSchedules } from "src/store-categories/enum/store-category.enum";
import { Store } from "src/stores/entities/store.entity";
import { Exists } from "src/validation/exists.constrain";
import { ProductFeaturesDto } from "./product-features.dto";

@Exclude()
export class AddToCartDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Exists(Store)
  readonly storeId: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly quantity: number;

  @Expose()
  @Exists(Product, 'id', (id, { storeId }: AddToCartDto) => ({
    join: {
      alias: 'product',
      innerJoin: {
        store: 'product.store',
        storeCategory: 'store.storeCategory',
      },
    },
    where: qb => {
      qb.where({ id })
        .andWhere('store.id = :storeId', { storeId })
        .andWhere('storeCategory.name NOT IN(:...storeCategoryNames)', { storeCategoryNames: StoreCategoriesWithSchedules });
    }
  }))
  readonly productId: number;

  @Expose()
  @ValidateNested()
  readonly productFeaturesData: ProductFeaturesDto;

  @Expose()
  @IsBoolean()
  readonly isDirectPurchase: boolean;

  @Expose()
  readonly discountId: number;
}
