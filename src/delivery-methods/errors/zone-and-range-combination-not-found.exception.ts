import { HttpException, HttpStatus } from "@nestjs/common";

export class RangeAndZoneCombinationNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Combinación de rango y zona no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
