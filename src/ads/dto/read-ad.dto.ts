import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { format } from "date-fns";
import { ReadAdsPositionDto } from "src/ads-positions/dto/read-ads-position.dto";
import { ReadStoreDto } from "src/stores/dto/read-store.dto";
import { User } from "src/users/entities/user.entity";

@Exclude()
export class ReadAdDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly imgPath: string;

  @Expose()
  readonly title: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly url: string;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly from: Date;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly until: Date;

  @Expose()
  readonly priority: number;

  @Expose()
  readonly price: number;

  @Expose()
  @Transform(({obj}) => obj.store ? plainToClass(ReadStoreDto, User.create({store: obj.store})) : null)
  readonly store: ReadStoreDto;

  @Expose()
  @Type(() => ReadAdsPositionDto)
  readonly adsPosition: ReadAdsPositionDto;

  @Expose()
  readonly isActive: boolean;

  @Expose()
  readonly percentage: number;
}
