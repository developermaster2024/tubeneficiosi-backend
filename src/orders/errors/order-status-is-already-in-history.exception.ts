import { HttpException, HttpStatus } from "@nestjs/common";

export class OrderStatusIsAlreadyInHistoryException extends HttpException {
  constructor() {
    super({
      message: 'Estatus de orden ya existe en al historia',
    }, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
