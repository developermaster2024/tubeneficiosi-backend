import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { format } from "date-fns";
import { ReadProductDto } from "src/products/dto/read-product.dto";
import { ReadStoreDto } from "src/stores/dto/read-store.dto";
import { User } from "src/users/entities/user.entity";

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
  @Transform(({obj}) => obj.store ? plainToClass(ReadStoreDto, User.create({store: obj.store})) : null)
  readonly store: ReadStoreDto;

  @Expose()
  @Transform(({obj}) => obj?.store ? obj?.store?.products : null)
  @Type(() => ReadProductDto)
  readonly products: ReadProductDto[];

  @Expose()
  readonly isActive: boolean;
}
