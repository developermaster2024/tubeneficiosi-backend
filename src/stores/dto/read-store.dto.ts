import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Transform } from "class-transformer";
import { ReadUserDto } from "src/users/dto/read-user.dto";
import { User } from "src/users/entities/user.entity";

@Exclude()
export class ReadStoreDto extends OmitType(ReadUserDto, ['role']) {
  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.name)
  readonly name: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.phoneNumber)
  readonly phoneNumber: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.address)
  readonly address: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.latitude)
  readonly latitude: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.store.longitude)
  readonly longitude: string;
}
