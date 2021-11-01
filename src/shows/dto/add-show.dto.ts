import { Exclude, Expose, Type } from "class-transformer";
import { IsDate } from "class-validator";

@Exclude()
export class AddShowDto {
  @Expose()
  @Type(() => Number)
  readonly productId: number;

  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Date)
  @IsDate()
  readonly date: Date;

  @Expose()
  readonly placeId: number;
}
