import { HttpException, HttpStatus } from "@nestjs/common";

export class OrderStatusNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Estatus de orden no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}
