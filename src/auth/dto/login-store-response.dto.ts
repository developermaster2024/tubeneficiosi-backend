import { Exclude, Expose, Type } from "class-transformer";
import { ReadStoreDto } from "src/stores/dto/read-store.dto";

@Exclude()
export class LoginStoreResponseDto {
  @Expose()
  @Type(() => ReadStoreDto)
  user: ReadStoreDto;

  @Expose()
  accessToken: string;
}
