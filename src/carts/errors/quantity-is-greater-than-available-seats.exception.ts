import { HttpException, HttpStatus } from "@nestjs/common";

export class QuantityIsGreaterThanAvailableSeatsException extends HttpException {
  constructor() {
    super({
      message: 'La cantidad es más grande que la cantidad de puestos disponibles',
    }, HttpStatus.NOT_FOUND);
  }
}
