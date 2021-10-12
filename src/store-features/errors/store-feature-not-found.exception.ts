import { HttpException, HttpStatus } from "@nestjs/common";

export class StoreFeatureNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Característica de tienda no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
