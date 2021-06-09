import { HttpException, HttpStatus } from "@nestjs/common";

export class StoreProfileNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Perfil de tienda no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}
