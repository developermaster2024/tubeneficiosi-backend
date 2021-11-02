import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class DeleteShowDto {
  @Expose()
  readonly productId: number;

  @Expose()
  @Type(() => Number)
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly showId: number;
}
