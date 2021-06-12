import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadHelpCategoryDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly icon: string;
}
