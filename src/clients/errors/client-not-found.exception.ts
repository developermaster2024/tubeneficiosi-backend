import { HttpException, HttpStatus } from "@nestjs/common";

export class ClientNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Cliente no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}
