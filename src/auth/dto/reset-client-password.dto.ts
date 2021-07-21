import { OmitType } from "@nestjs/mapped-types";
import { Exclude, Expose } from "class-transformer";
import { IsString, MinLength } from "class-validator";
import { ForgotClientPasswordDto } from "./forgot-client-password.dto";

@Exclude()
export class ResetClientPasswordDto extends OmitType(ForgotClientPasswordDto, [] as const) {
  @Expose()
  token: string;

  @Expose()
  @IsString()
  @MinLength(8)
  readonly password: string;
}
