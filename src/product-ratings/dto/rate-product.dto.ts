import { Exclude, Expose } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

@Exclude()
export class RateProductDto {
  @Expose()
  readonly productId: number;

  @Expose()
  readonly userId: number;

  @Expose()
  readonly orderId: number;

  @Expose()
  @IsInt()
  @Min(1)
  @Max(5)
  readonly value: number;
}
