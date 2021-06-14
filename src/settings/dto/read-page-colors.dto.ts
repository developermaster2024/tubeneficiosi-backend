import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class ReadPageColorsDto {
  @Expose()
  @Transform(({obj}) => obj.value.primary)
  readonly primary: string;

  @Expose()
  @Transform(({obj}) => obj.value.secondary)
  readonly secondary: string;

  @Expose()
  @Transform(({obj}) => obj.value.tertiary)
  readonly tertiary: string;

  @Expose()
  @Transform(({obj}) => obj.value.success)
  readonly success: string;

  @Expose()
  @Transform(({obj}) => obj.value.warning)
  readonly warning: string;

  @Expose()
  @Transform(({obj}) => obj.value.danger)
  readonly danger: string;

  @Expose()
  @Transform(({obj}) => obj.value.dark)
  readonly dark: string;
}
