import { HttpException, HttpStatus } from "@nestjs/common";

export class CardNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Tarjeta no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
