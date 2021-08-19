import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductQuantityIsLessThanRequiredQuantityException extends HttpException {
  constructor() {
    super({
      message: 'La cantidad del producto es menor a la cantidad solicitada',
    }, HttpStatus.CONFLICT);
  }
}
