import { HttpException, HttpStatus } from "@nestjs/common";

export class PasswordDoesNotMatchException extends HttpException {
  constructor() {
    super({
      message: 'La contraseña actual es incorrecta',
    }, HttpStatus.BAD_REQUEST);
  }
}
