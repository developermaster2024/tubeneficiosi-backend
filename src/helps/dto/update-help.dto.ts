import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { IsString, MaxLength } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Not } from "typeorm";
import { Help } from "../entities/help.entity";
import { CreateHelpDto } from "./create-help.dto";

@Exclude()
export class UpdateHelpDto extends OmitType(CreateHelpDto, ['title'] as const) {
  @Expose()
  readonly id: number;

  @Expose()
  @IsString()
  @MaxLength(255)
  @IsUnique(Help, (value, dto: UpdateHelpDto) => ({
    where: {title: value, id: Not(dto.id)}
  }))
  readonly title: string;
}
