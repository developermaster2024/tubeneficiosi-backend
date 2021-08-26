import { HttpException, HttpStatus } from "@nestjs/common";

export class UserMustBeAdminException extends HttpException {
  constructor() {
    super({
      message: 'El usuario debe ser administrador',
    }, HttpStatus.CONFLICT);
  }
}
