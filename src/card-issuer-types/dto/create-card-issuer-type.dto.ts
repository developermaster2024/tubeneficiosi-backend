import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, MaxLength } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { CardIssuerType } from "../entities/card-issuer-type.entity";

@Exclude()
export class CreateCardIssuerTypeDto {
  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  @IsUnique(CardIssuerType)
  readonly name: string;
}
