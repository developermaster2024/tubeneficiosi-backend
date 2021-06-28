import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Transform } from "class-transformer";
import { ReadUserDto } from "src/users/dto/read-user.dto";
import { User } from "src/users/entities/user.entity";

@Exclude()
export class ReadClientDto extends OmitType(ReadUserDto, ['role']) {
  @Expose()
  @Transform(({obj}: {obj: User}) => obj.client.name)
  readonly name: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.client.phoneNumber)
  readonly phoneNumber: string;

  @Expose()
  @Transform(({obj}: {obj: User}) => obj.client.imgPath)
  readonly imgPath: string;
}
