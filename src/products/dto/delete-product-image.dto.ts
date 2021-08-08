import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class DeleteProductImageDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly productId: number;

  @Expose()
  @Type(() => Number)
  readonly position: number;
}
