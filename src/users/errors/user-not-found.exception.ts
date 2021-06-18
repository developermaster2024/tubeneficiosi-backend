import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Usuario no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}
