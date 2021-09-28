import { HttpException, HttpStatus } from "@nestjs/common";

export class RangeIsBetweenExistingRangesException extends HttpException {
  constructor() {
    super({
      message: 'El rango esta dentro del los rangos existentes',
    }, HttpStatus.CONFLICT);
  }
}
