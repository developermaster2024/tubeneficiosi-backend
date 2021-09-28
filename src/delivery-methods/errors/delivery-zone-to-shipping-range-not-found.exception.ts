import { HttpException, HttpStatus } from "@nestjs/common";

export class DeliveryZoneToShippingRangeNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Zona a rango de envío no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
