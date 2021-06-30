import { OmitType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import { MaxLength, ValidateIf } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { Not } from "typeorm";
import { Bank } from "../entities/bank.entity";
import { CreateBankDto } from "./create-bank.dto";

export class UpdateBankDto extends OmitType(CreateBankDto, ['image', 'name'] as const) {
  @Expose()
  readonly id: string;

  @Expose()
  @MaxLength(250)
  @IsUnique(Bank, (value, dto: UpdateBankDto) => ({
    where: {name: value, id: Not(dto.id)},
  }))
  readonly name: string;

  @Expose()
  @ValidateIf(obj => obj.image)
  @IsMimeType(['image/png', 'image/jpeg'])
  readonly image: Express.Multer.File;
}
