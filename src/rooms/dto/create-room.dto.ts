import { Exclude, Expose, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, MaxLength, ValidateNested } from "class-validator";
import { CreateSeatGroupDto } from "./create-seat-group.dto";

@Exclude()
export class CreateRoomDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @Type(() => CreateSeatGroupDto)
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  readonly seatGroups: CreateSeatGroupDto[];
}
