import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class DeleteNewsDto {
  @Expose()
  @Type(() => Number)
  readonly id: number;

  @Expose()
  readonly userId: number;
}
