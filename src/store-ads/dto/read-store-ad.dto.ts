import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { format } from "date-fns";
import { ReadProductDto } from "src/products/dto/read-product.dto";

@Exclude()
export class ReadStoreAdDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly price: number;

  @Expose()
  readonly priority: number;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly from: string;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly until: string;

  @Expose()
  @Transform(({obj}) => obj?.store ? obj.store.name : null)
  readonly name: string;

  @Expose()
  @Transform(({obj}) => obj?.store?.storeProfile ? obj.store.storeProfile.banner : null)
  readonly banner: string;

  @Expose()
  @Transform(({obj}) => obj?.store?.storeProfile ? obj.store.storeProfile.logo : null)
  readonly logo: string;

  @Expose()
  @Transform(({obj}) => obj?.store ? obj?.store?.products : null)
  @Type(() => ReadProductDto)
  readonly products: ReadProductDto[];
}
