import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadStoreCategoryDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly imgPath: string;

  @Expose()
  readonly logo: string;

  @Expose()
  readonly mapIcon: string;
}
