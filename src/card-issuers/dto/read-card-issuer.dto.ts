import { Exclude, Expose, Type } from "class-transformer";
import { ReadCardIssuerType } from "src/card-issuer-types/entities/dto/read-card-issuer-type.dto";

@Exclude()
export class ReadCardIssuerDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly imgPath: string;

  @Expose()
  @Type(() => ReadCardIssuerType)
  readonly cardIssuerType: ReadCardIssuerType;
}
