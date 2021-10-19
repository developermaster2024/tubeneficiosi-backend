import { Exclude, Expose, Type } from "class-transformer";
import { IsNotEmpty, MaxLength, Min } from "class-validator";

@Exclude()
export class CreateSeatGroupDto {
  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;

  @Expose()
  @Type(() => Number)
  @Min(1)
  readonly capacity: number;
}
