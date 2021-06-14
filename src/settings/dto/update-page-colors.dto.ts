import { Exclude, Expose } from "class-transformer";
import { IsHexColor } from "class-validator";

@Exclude()
export class UpdatePageColorsDto {
  @Expose()
  @IsHexColor()
  readonly primary: string;

  @Expose()
  @IsHexColor()
  readonly secondary: string;

  @Expose()
  @IsHexColor()
  readonly tertiary: string;

  @Expose()
  @IsHexColor()
  readonly success: string;

  @Expose()
  @IsHexColor()
  readonly warning: string;

  @Expose()
  @IsHexColor()
  readonly danger: string;

  @Expose()
  @IsHexColor()
  readonly dark: string;

}
