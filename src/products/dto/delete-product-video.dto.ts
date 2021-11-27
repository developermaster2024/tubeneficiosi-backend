import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class DeleteProductVideoDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly productId: number;

  @Expose()
  @Type(() => Number)
  readonly videoId: number;
}
