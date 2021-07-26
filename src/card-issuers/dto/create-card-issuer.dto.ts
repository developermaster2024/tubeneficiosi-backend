import { Exclude, Expose } from "class-transformer";
import { MaxLength } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { CardIssuer } from "../entities/card-issuer.entity";

@Exclude()
export class CreateCardIssuerDto {
  @Expose()
  @MaxLength(250)
  @IsUnique(CardIssuer)
  readonly name: string;

  @Expose()
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly image: Express.Multer.File;
}
