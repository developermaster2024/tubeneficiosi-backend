import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { IsString, MaxLength, ValidateIf } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { IsMimeType } from "src/validation/mime-type.constrain";
import { Not } from "typeorm";
import { HelpCategory } from "../entities/help-category.entity";
import { CreateHelpCategoryDto } from "./create-help-category.dto";

@Exclude()
export class UpdateHelpCategoryDto extends OmitType(CreateHelpCategoryDto, ['name', 'icon'] as const) {
  @Expose()
  readonly id: number;

  @Expose()
  @IsString()
  @MaxLength(255)
  @IsUnique(HelpCategory, (value, dto: UpdateHelpCategoryDto) => ({
    where: {name: value, id: Not(dto.id)}
  }))
  readonly name: string;

  @Expose()
  @ValidateIf(obj => obj.icon)
  @IsMimeType(['image/jpeg', 'image/png'])
  readonly icon: Express.Multer.File;
}
