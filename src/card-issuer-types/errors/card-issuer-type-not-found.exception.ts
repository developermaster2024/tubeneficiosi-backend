import { HttpException, HttpStatus } from "@nestjs/common";

export class CardIssuerTypeNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Tipo de emisor de tarjetas no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}
