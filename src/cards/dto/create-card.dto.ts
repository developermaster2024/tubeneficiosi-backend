import { Exclude, Expose, Type } from "class-transformer";
import { IsNotEmpty, MaxLength } from "class-validator";
import { CardIssuer } from "src/card-issuers/entities/card-issuer.entity";
import { CardType } from "src/card-types/entities/card-type.entity";
import { Exists } from "src/validation/exists.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";

@Exclude()
export class CreateCardDto {
  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly image: Express.Multer.File;

  @Expose()
  @Type(() => Number)
  @Exists(CardIssuer)
  readonly cardIssuerId: number;

  @Expose()
  @Type(() => Number)
  @Exists(CardType)
  readonly cardTypeId: number;
}
