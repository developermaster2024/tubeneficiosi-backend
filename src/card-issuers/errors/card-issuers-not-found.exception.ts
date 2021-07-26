import { HttpException, HttpStatus } from "@nestjs/common";

export class CardIssuerNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Emisor de tarjeta no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}
