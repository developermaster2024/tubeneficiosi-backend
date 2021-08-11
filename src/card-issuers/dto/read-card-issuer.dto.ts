import { Exclude, Expose, Type } from "class-transformer";
import { ReadCardIssuerTypeDto } from "src/card-issuer-types/dto/read-card-issuer-type.dto";

@Exclude()
export class ReadCardIssuerDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly imgPath: string;

  @Expose()
  @Type(() => ReadCardIssuerTypeDto)
  readonly cardIssuerType: ReadCardIssuerTypeDto;
}
