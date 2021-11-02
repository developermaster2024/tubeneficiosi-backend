import { Exclude, Expose, Type } from "class-transformer";
import { IsDate } from "class-validator";
import { Product } from "src/products/entities/product.entity";
import { StoreCategoriesWithSchedules } from "src/store-categories/enum/store-category.enum";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class AddShowDto {
  @Expose()
  @Type(() => Number)
  @Exists(Product, 'id', (id, { userId }: AddShowDto) => ({
    join: {
      alias: 'product',
      innerJoin: {
        store: 'product.store',
        storeCategory: 'store.storeCategory',
      },
    },
    where: qb => {
      qb.where({ id })
        .andWhere('store.userId = :userId', { userId })
        .andWhere('storeCategory.name IN(:...storeCategoryNames)', { storeCategoryNames: StoreCategoriesWithSchedules });
    }
  }))
  readonly productId: number;

  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Date)
  @IsDate()
  readonly date: Date;

  @Expose()
  readonly placeId: number;
}
