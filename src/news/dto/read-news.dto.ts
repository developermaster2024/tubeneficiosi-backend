import { Exclude, Expose, plainToClass, Transform } from "class-transformer";
import { ReadStoreDto } from "src/stores/dto/read-store.dto";
import { User } from "src/users/entities/user.entity";

@Exclude()
export class ReadNewsDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly title: string;

  @Expose()
  readonly imgPath: string;

  @Expose()
  readonly redirectUrl: string;

  @Expose()
  @Transform(({obj}) => obj.store ? plainToClass(ReadStoreDto, User.create({store: obj.store})) : null)
  readonly store: ReadStoreDto;
}
