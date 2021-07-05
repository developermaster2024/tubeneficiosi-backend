import { HttpException, HttpStatus } from "@nestjs/common";

export class StoreAdNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Publicidad de tienda no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
