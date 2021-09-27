import { Role } from "src/users/enums/roles.enum";

export interface SendForgotPasswordEmailDto {
  email: string;
  token: string;
  fullName: string;
  role: Role;
}
