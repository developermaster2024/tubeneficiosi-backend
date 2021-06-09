import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { IsString, MaxLength } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Not } from "typeorm";
import { Category } from "../entities/category.entity";
import { CreateCategoryDto } from "./create-category.dto";

@Exclude()
export class UpdateCategoryDto extends OmitType(CreateCategoryDto, ['name'] as const) {
  @Expose()
  readonly id: number;

  @Expose()
  @IsString()
  @MaxLength(255)
  @IsUnique(Category, (value, dto: UpdateCategoryDto) => ({
    where: {name: value, id: Not(dto.id)}
  }))
  readonly name: string;
}
