import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadWidgetDto {
  @Expose()
  readonly type: string;

  @Expose()
  readonly value: string;

  @Expose()
  readonly url: string;

  @Expose()
  readonly image: string;

  @Expose()
  readonly facebook: string;

  @Expose()
  readonly instagram: string;

  @Expose()
  readonly twitter: string;

  @Expose()
  readonly youtube: string;
}
