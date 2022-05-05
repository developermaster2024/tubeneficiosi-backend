import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class LocalAuthAdminGuard extends AuthGuard('local-admin') {
    handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
        if (user === false) {
            throw new UnauthorizedException('Debe ingresar sus credenciales');
        }

        return super.handleRequest(err, user, info, context, status);
    }
}
