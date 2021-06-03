import { Exclude, Expose, Type } from "class-transformer";
import { ReadUserDto } from "src/users/dto/read-user.dto";

@Exclude()
export class RegisterResponseDto {
  @Expose()
  @Type(() => ReadUserDto)
  user: ReadUserDto;

  @Expose()
  accessToken: string;
}
