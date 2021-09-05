import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { format } from "date-fns";
import { ReadCardIssuerDto } from "src/card-issuers/dto/read-card-issuer.dto";
import { ReadCardDto } from "src/cards/dto/read-card.dto";
import { DiscountType } from "src/discount-types/entities/discount-type.entity";
import { ReadStoreDto } from "src/stores/dto/read-store.dto";
import { User } from "src/users/entities/user.entity";

@Exclude()
export class ReadDiscountDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly value: number;

  @Expose()
  readonly imgPath: string;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly from: Date;

  @Expose()
  @Transform(({value}) => format(value, 'yyyy-MM-dd HH:mm:ss'))
  readonly until: Date;

  @Expose()
  readonly discountType: DiscountType;

  @Expose()
  @Type(() => ReadCardDto)
  readonly cards: ReadCardDto[];

  @Expose()
  @Type(() => ReadCardIssuerDto)
  readonly cardIssuers: ReadCardIssuerDto[];

  @Expose()
  @Transform(({obj}) => obj.store ? plainToClass(ReadStoreDto, User.create({store: obj.store})) : null)
  readonly store: ReadStoreDto;
}
