import { Exclude, Expose, Type } from "class-transformer";
import { ReadCardIssuerDto } from "src/card-issuers/dto/read-card-issuer.dto";
import { ReadCardTypeDto } from "src/card-types/dto/read-card-type.dto";

@Exclude()
export class ReadCardDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly imgPath: string;

  @Expose()
  @Type(() => ReadCardIssuerDto)
  readonly cardIssuer: ReadCardIssuerDto;

  @Expose()
  @Type(() => ReadCardTypeDto)
  readonly cardType: ReadCardTypeDto;
}
