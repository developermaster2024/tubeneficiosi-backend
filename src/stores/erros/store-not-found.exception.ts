import { HttpException, HttpStatus } from "@nestjs/common";

export class StoreNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Tienda no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
