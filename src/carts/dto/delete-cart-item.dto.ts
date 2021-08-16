import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class DeleteCartitemDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly cartId: number;

  @Expose()
  @Type(() => Number)
  readonly cartItemId: number;
}
