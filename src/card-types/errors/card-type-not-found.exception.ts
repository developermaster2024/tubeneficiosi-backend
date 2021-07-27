import { HttpException, HttpStatus } from "@nestjs/common";

export class CardTypeNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Tipo de tarjeta no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
