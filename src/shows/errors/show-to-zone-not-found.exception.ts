import { HttpException, HttpStatus } from "@nestjs/common";

export class ShowToZoneNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Función por zona no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
