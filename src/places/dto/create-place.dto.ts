import { Exclude, Expose, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, MaxLength, ValidateNested } from "class-validator";
import { CreateZoneDto } from "./create-zone.dto";

@Exclude()
export class CreatePlaceDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @Type(() => CreateZoneDto)
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  readonly zones: CreateZoneDto[];
}
