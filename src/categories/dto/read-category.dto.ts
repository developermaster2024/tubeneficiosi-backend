import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class ReadCategoryDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;
}
