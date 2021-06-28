import { HttpException, HttpStatus } from "@nestjs/common";

export class FeaturedAdNotFoundException extends HttpException {
  constructor() {
    super({
      message: 'Anuncion destacado no encontrado',
    }, HttpStatus.NOT_FOUND);
  }
}
