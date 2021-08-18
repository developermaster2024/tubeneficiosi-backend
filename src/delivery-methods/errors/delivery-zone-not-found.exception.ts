import { HttpException, HttpStatus } from "@nestjs/common";

export class DeliveryZoneNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Zona de envío no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
