import { Exclude, Expose } from "class-transformer";
import { IsString, MaxLength } from "class-validator";
import { IsUnique } from "src/validation/is-unique.constrain";
import { Brand } from "../entities/brand.entity";

@Exclude()
export class CreateBrandDto {
  @Expose()
  @IsString()
  @MaxLength(255)
  @IsUnique(Brand)
  readonly name: string;
}
