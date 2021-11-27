import { OmitType } from "@nestjs/mapped-types";
import { Expose, Type } from "class-transformer";
import { Exists } from "src/validation/exists.constrain";
import { Product } from "../entities/product.entity";
import { CreateProductVideoDto } from "./create-product-video.dto";

export class AddProductVideoDto extends OmitType(CreateProductVideoDto, [] as const) {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  @Exists(Product, 'id', (id: number, { userId }: AddProductVideoDto) => ({
    join: {
      alias: 'product',
      innerJoin: {
        store: 'product.store',
      }
    },
    where: qb => {
      qb.where({ id })
        .andWhere('store.userId = :userId', { userId });
    }
  }))
  readonly productId: number;
}
