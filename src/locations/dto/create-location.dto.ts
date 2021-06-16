import { Exclude, Expose } from "class-transformer";
import { MaxLength, ValidateIf } from "class-validator";
import { Exists } from "src/validation/exists.constrain";
import { Location } from "../entities/location.entity";

@Exclude()
export class CreateLocationDto {
  @Expose()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @ValidateIf(obj => obj.parentId)
  @Exists(Location)
  readonly parentId: number;

  @Expose()
  readonly area: string;
}
