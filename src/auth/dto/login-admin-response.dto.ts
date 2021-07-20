import { Exclude, Expose, Type } from "class-transformer";
import { ReadAdminDto } from "src/users/dto/read-admin.dto";

@Exclude()
export class LoginAdminResponse {
  @Expose()
  @Type(() => ReadAdminDto)
  user: ReadAdminDto;

  @Expose()
  accessToken: string;
}
