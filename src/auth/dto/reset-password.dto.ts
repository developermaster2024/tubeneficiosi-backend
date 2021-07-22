import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { IsString, MinLength } from "class-validator";
import { ForgotPasswordDto } from "./forgot-password.dto";

@Exclude()
export class ResetPasswordDto extends OmitType(ForgotPasswordDto, [] as const) {
  @Expose()
  token: string;

  @Expose()
  @IsString()
  @MinLength(8)
  readonly password: string;
}
