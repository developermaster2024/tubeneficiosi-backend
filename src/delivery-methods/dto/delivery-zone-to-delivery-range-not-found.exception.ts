import { HttpException, HttpStatus } from "@nestjs/common";

export class DeliveryZoneToDeliveryRangeNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Zona a rango de entrega no encontrada'
    }, HttpStatus.NOT_FOUND);
  }
}
