import { Exclude, Expose } from "class-transformer";
import { MaxLength } from "class-validator";

@Exclude()
export class UpdateFooterSectionDto {
  @Expose()
  readonly id: string;

  @Expose()
  @MaxLength(50)
  readonly name: string;
}
