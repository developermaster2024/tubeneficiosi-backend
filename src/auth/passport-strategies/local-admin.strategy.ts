import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { User } from "src/users/entities/user.entity";
import { Role } from "src/users/enums/roles.enum";
import { UserStatuses } from "src/users/enums/user-statuses.enum";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(Strategy, 'local-admin') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<Partial<User>> {
    const user = await this.authService.validateUser(email, password, Role.ADMIN);

    if (!user) {
      throw new UnauthorizedException('Usuario no existe o esta inactivo');
    }

    if (user.userStatus.code === UserStatuses.INACTIVE) {
      throw new UnauthorizedException('El usuario está inactivo');
    }

    if (user.userStatus.code === UserStatuses.BANNED) {
      throw new UnauthorizedException('El usuario está baneado');
    }

    return user;
  }
}
