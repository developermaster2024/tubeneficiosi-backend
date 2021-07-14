import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose, Transform } from "class-transformer";
import { ReadUserDto } from "./read-user.dto";

@Exclude()
export class ReadAdminDto extends OmitType(ReadUserDto, [] as const) {
  @Expose()
  @Transform(({obj}) => obj.admin ? obj.admin.name : null)
  readonly name: string;

  @Expose()
  @Transform(({obj}) => obj.admin ? obj.admin.phoneNumber : null)
  readonly phoneNumber: string;

  @Expose()
  @Transform(({obj}) => obj.admin ? obj.admin.address : null)
  readonly address: string;

  @Expose()
  @Transform(({obj}) => obj.admin ? obj.admin.imgPath : null)
  readonly imgPath: string;
}
