import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, MaxLength } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Not } from "typeorm";
import { CardIssuerType } from "../entities/card-issuer-type.entity";
import { CreateCardIssuerTypeDto } from "./create-card-issuer-type.dto";

@Exclude()
export class UpdateCardIssuerTypeDto extends OmitType(CreateCardIssuerTypeDto, ['name'] as const) {
  @Expose()
  readonly id: number;

  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  @IsUnique(CardIssuerType, (value, dto: UpdateCardIssuerTypeDto) => ({
    where: { name: value, id: Not(dto.id) },
  }))
  readonly name: string;
}
