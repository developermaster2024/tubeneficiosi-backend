import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductAlreadyRatedException extends HttpException {
  constructor() {
    super({
      message: 'El producto ya ha sido calificado',
    }, HttpStatus.CONFLICT);
  }
}
