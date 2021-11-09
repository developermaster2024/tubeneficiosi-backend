import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadNewsDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly title: string;

  @Expose()
  readonly imgPath: string;

  @Expose()
  readonly redirectUrl: string;
}
