import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { IsString, MaxLength } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Not } from "typeorm";
import { Tag } from "../entities/tag.entity";
import { CreateTagDto } from "./create-tag.dto";

@Exclude()
export class UpdateTagDto extends OmitType(CreateTagDto, ['name'] as const) {
  @Expose()
  readonly id: number;

  @Expose()
  @IsString()
  @MaxLength(255)
  @IsUnique(Tag, (value, dto: UpdateTagDto) => ({
    where: {name: value, id: Not(dto.id)}
  }))
  readonly name: string;
}
