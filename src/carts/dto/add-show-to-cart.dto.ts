import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { Product } from "src/products/entities/product.entity";
import { StoreCategoriesWithSchedules } from "src/store-categories/enum/store-category.enum";
import { Exists } from "src/validation/exists.constrain";
import { AddToCartDto } from "./add-to-cart.dto";

@Exclude()
export class AddShowToCartDto extends OmitType(AddToCartDto, [
  'productFeaturesData', 'isDirectPurchase', 'discountId', 'productId',
] as const) {
  @Expose()
  @Exists(Product, 'id', (id, { storeId }: AddShowToCartDto) => ({
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
        .andWhere('storeCategory.name IN(:...storeCategoryNames)', { storeCategoryNames: StoreCategoriesWithSchedules });
    }
  }))
  readonly productId: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  readonly showId: number;

  @Expose()
  @Type(() => Number)
  @IsNumber()
  readonly zoneId: number;
}
