import { Exclude, Expose, Type } from "class-transformer";
import { ReadClientDto } from "src/clients/dto/read-client.dto";

@Exclude()
export class RegisterResponseDto {
  @Expose()
  @Type(() => ReadClientDto)
  user: ReadClientDto;

  @Expose()
  accessToken: string;
}
