import { HttpException, HttpStatus } from "@nestjs/common";

export class OrderNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Orden no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
