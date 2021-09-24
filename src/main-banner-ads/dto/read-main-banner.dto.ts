import { Exclude, Expose, plainToClass, Transform } from "class-transformer";
import { format } from "date-fns";
import { ReadStoreDto } from "src/stores/dto/read-store.dto";
import { User } from "src/users/entities/user.entity";

@Exclude()
export class ReadMainBannerAdDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly url: string;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly from: string;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly until: string;

  @Expose()
  readonly priority: number;

  @Expose()
  readonly price: number;

  @Expose()
  readonly imgPath: string;

  @Expose()
  @Transform(({obj}) => obj.store ? plainToClass(ReadStoreDto, User.create({store: obj.store})) : null)
  readonly store: ReadStoreDto;

  @Expose()
  readonly isActive: boolean;

  @Expose()
  readonly percentage: number;
}
