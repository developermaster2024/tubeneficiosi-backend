import { HttpException, HttpStatus } from "@nestjs/common";

export class StoreHourNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Horario de tienda no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}
