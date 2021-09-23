import { HttpException, HttpStatus } from "@nestjs/common";

export class StoreAlreadyRatedException extends HttpException {
  constructor() {
    super({
      message: 'La tienda ya ha sido calificada',
    }, HttpStatus.CONFLICT);
  }
}
