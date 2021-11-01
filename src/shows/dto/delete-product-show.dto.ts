import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class DeleteProductShowDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @Type(() => Number)
  readonly id: number;
}
