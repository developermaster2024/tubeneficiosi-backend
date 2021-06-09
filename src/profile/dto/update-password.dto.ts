import { Exclude, Expose } from "class-transformer";
import { IsString, MinLength } from "class-validator";

@Exclude()
export class UpdatePasswordDto {
  @Expose()
  readonly userId: number;

  @Expose()
  @IsString()
  @MinLength(8)
  readonly currentPassword: string;

  @Expose()
  @IsString()
  @MinLength(8)
  readonly password: string;
}
