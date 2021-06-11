import { Exclude, Expose } from "class-transformer";
import { IsString, MaxLength } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Not } from "typeorm";
import { Brand } from "../entities/brand.entity";

@Exclude()
export class UpdateBrandDto {
  @Expose()
  readonly id: number;

  @Expose()
  @IsString()
  @MaxLength(255)
  @IsUnique(Brand, (value, dto: UpdateBrandDto) => ({
    where: {name: value, id: Not(dto.id)}
  }))
  readonly name: string;
}
