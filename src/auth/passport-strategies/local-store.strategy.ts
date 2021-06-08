import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { User } from "src/users/entities/user.entity";
import { Role } from "src/users/enums/roles.enum";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStoreStrategy extends PassportStrategy(Strategy, 'local-store') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<Partial<User>> {
    const user = await this.authService.validateUser(email, password, Role.STORE);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no existe o esta inactivo');
    }

    return user;
  }
}
