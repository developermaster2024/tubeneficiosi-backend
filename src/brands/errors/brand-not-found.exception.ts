import { HttpException, HttpStatus } from "@nestjs/common";

export class BrandNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Marca no encontrada',
    }, HttpStatus.NOT_FOUND);
  }
}
