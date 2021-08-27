import { HttpException, HttpStatus } from "@nestjs/common";

export class DeliveryNoteNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Albarán de entrega no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}
