import { OmitType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { MaxLength, ValidateIf } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { Not } from "typeorm";
import { CardIssuer } from "../entities/card-issuer.entity";
import { CreateCardIssuerDto } from "./create-card-issuer.dto";

export class UpdateCardIssuerDto extends OmitType(CreateCardIssuerDto, ['image', 'name'] as const) {
  @Expose()
  readonly id: string;

  @Expose()
  @MaxLength(250)
  @IsUnique(CardIssuer, (value, dto: UpdateCardIssuerDto) => ({
    where: {name: value, id: Not(dto.id)},
  }))
  readonly name: string;

  @Expose()
  @ValidateIf(obj => obj.image)
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly image: Express.Multer.File;
}
