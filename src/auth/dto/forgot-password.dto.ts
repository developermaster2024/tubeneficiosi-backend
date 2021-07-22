import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ForgotPasswordDto {
  @Expose()
  readonly email: string;
}
